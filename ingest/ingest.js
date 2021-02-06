const fs = require('fs');
const Client = require("@googlemaps/google-maps-services-js").Client;
const pLimit = require('p-limit');

const limit = pLimit(1);

const client = new Client({})
const key = process.env.GMAP_KEY

const data = JSON.parse(fs.readFileSync('data.json', 'utf8').trim())

async function getObjs() {
    let promises = []
    let result = []

    for (let j = 0; j < 500; j++) {
        const feature = data.features[j]
        const coords = feature.geometry.coordinates
        promises.push(
            limit(() => client
                .nearestRoads({
                    params: {
                        points: [{ lat: coords[1], lng: coords[0] }],
                        key: key
                    }
                })
                .then(point => point.data.snappedPoints[0].placeId)
                .then(placeId =>
                    Promise.resolve(
                        client.
                            geocode({
                                params: {
                                    place_id: placeId,
                                    key: key
                                }
                            })
                            .catch((e) => {
                                console.log(e.response.data.error_message);
                            })
                    )
                )
                .then(place => {
                    result.push(
                        {
                            lat: coords[1],
                            lng: coords[0],
                            street: place.data.results[0].address_components[1].long_name,
                            street_number: place.data.results[0].address_components[0].long_name
                        })

                })
                .catch((e) => {
                    console.log(e.response.data.error_message);
                })
            ))
    }
    await Promise.all(promises)
    return result
}

async function writeToOut() {
    let out = { table: [] }
    const objs = await getObjs()
    out.table = objs
    fs.writeFileSync('out.json', JSON.stringify(out, null, "\t"), 'utf8')
}

writeToOut()