const fs = require('fs');
const Client = require("@googlemaps/google-maps-services-js").Client;
const pLimit = require('p-limit');

const limit = pLimit(6);

const client = new Client({})
const key1 = process.env.GMAP_KEY1
const key2 = process.env.GMAP_KEY2
const data = JSON.parse(fs.readFileSync('data.json', 'utf8').trim())

async function getObjs() {
    let promises = []
    let result = []

    for (let j = 0; j < 9614; j++) { //9614
        const feature = data.features[j]
        const coords = feature.geometry.coordinates
        promises.push(
            limit(() => client
                .nearestRoads({
                    params: {
                        points: [{ lat: coords[1], lng: coords[0] }],
                        key: key1
                    }
                })
                .then(point => point.data.snappedPoints[0].placeId)
                .then(placeId =>
                    Promise.resolve(
                        client.
                            geocode({
                                params: {
                                    place_id: placeId,
                                    key: key2
                                }
                            })
                            .catch((e) => {
                                console.error('oh no! Line 38!');
                            })
                    )
                )
                .then(place => {
                    const oneLight = {
                        lat: coords[1],
                        lng: coords[0],
                        street: place.data.results[0].address_components[1].long_name,
                        street_number: place.data.results[0].address_components[0].long_name
                    };
                    result.push(oneLight);
                    console.log(oneLight, ',');

                })
                .catch((e) => {
                    console.error('oh no! Line 53!');
                })
            ))
    }
    await Promise.allSettled(promises)
    return result
}

async function writeToOut() {
    let out = { table: [] }
    const objs = await getObjs()
    out.table = objs
    fs.writeFileSync('out.json', JSON.stringify(out, null, "\t"), 'utf8')
}

//writeToOut()

// console.log({
//         lat: 32.2,
//         lng: 23.3,
//         street: "d",
//         street_number: "d"
// }, ',');

//console.log(',');

// console.error('oh no! Line 53!');

const data2 = JSON.parse(fs.readFileSync('out.json', 'utf8').trim())

console.log(data2.table[0])
console.log(data2.table[10])
console.log(data2.table.length)
