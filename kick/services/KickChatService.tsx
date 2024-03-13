// async getKick7TvEmotesList(streamerUserId: any, emoteDict: any) {
    export const getKick7TvEmotesList = async (
        streamerUserId: any
      ) => {
        let emoteDict: any = {};
        const endpointUrl = 'https://7tv.io/v3/gql';
        const connectionPlatform = 'KICK';
        const userByConnectionQuery = `
            query GetUserByConnection($platform: ConnectionPlatform!, $id: String!) {
              user: userByConnection(platform: $platform, id: $id) {
                id
                username
                connections {
                  id
                  username
                  display_name
                  platform
                  linked_at
                  emote_capacity
                  emote_set_id
                }
              }
            }
          `;
      
        async function getUserByConnection(platform: string, id: any) {
          const response = await fetch(endpointUrl, {
            credentials: 'omit',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              query: userByConnectionQuery,
              variables: { platform, id },
            }),
            method: 'POST',
            mode: 'cors',
          });
      
          const data = await response.json();
          return data;
        }
        const data = await getUserByConnection(
          connectionPlatform,
          streamerUserId?.toString(),
        );
        console.log('userbyconnection', JSON.stringify(data));
        // check for response status
        let emoteSetId = '';
        if (data.data.user) {
          for (const i of data.data.user.connections) {
            if (i.platform === 'KICK') {
              console.log(i.emote_set_id);
              emoteSetId = i.emote_set_id;
            }
          }
        }
      
        if (emoteSetId) {
          // const emoteSetQuery = `
          //   query GetEmoteSet($id: ObjectID!) {
          //     emoteSet(id: $id) {
          //       emotes {
          //         id
          //         name
          //       }
          //     }
          //   }
          // `;
          // also need animated. animed is in emotes then data then animated
          //   const emoteSetQuery = `
          //   query GetEmoteSet($id: ObjectID!) {
          //     emoteSet(id: $id) {
          //         emotes {
          //             id
          //             name
          //             data {
          //                 animated
          //             }
          //         }
          //     }
          // }
          //   `;
      
          const emoteSetQuery = `
          query GetEmoteSet($id: ObjectID!) {
            emoteSet(id: $id) {
              emotes {
                id
                name
                data {
                  animated
                }
              }
            }
          }
          `;
      
          async function getEmoteSetData(emoteSetId2: string) {
            const response = await fetch(endpointUrl, {
              credentials: 'omit',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                query: emoteSetQuery,
                // variables: { id: emoteSetId, formats: ["AVIF", "WEBP"] }, // Add any desired image formats here
                variables: { id: emoteSetId2 }, // Add any desired image formats here
              }),
              method: 'POST',
              mode: 'cors',
            });
      
            const data2 = await response.json();
            // console.log('emoteSetData', JSON.stringify(data2));
            return data2;
          }
          const emoteSetData = await getEmoteSetData(emoteSetId);
          // console.log('emoteSetData', emoteSetData);
          if (emoteSetData.data.emoteSet) {
            for (const i of emoteSetData.data.emoteSet.emotes) {
              // emoteDict[i.name] = i.id;
              emoteDict[i.name] = [i.id, i.data.animated];
            }
          }
        } // end if emoteSetId
        // console.log('emoteDict', this.emoteDict);
        // console.log('emoteDict', emoteDict);
        if (emoteDict) {
            console.log('7tv found, emotes length', Object.keys(emoteDict).length);
        } else {
            console.log('7tv not found');
        }
        return emoteDict;
      }; // end getKick7TvEmotesList() function
      