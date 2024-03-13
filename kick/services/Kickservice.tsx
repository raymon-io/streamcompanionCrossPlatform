import { Kickinterface } from '../interfaces/Kickinterface';

// getapi only
export const getApi = async (searchUsername: string) => {
  const url = 'https://kick.com/api/v2/channels/' + searchUsername;
  const url2 = url; // use a proxy url to avoid CORS issues
  // regular fetch
  console.log('///////////// GETAPI START url', url);
  let response: any;
  try {
    response = await fetch(url);
    console.log('GETAPI fetch status', response.status)
  } catch (error) {
    console.log('GETAPI fetch error', error, 'url', url);
  }
  let returnData: Kickinterface | null = null;
  if (response && response.status === 200) {
    console.log("GETAPI fetch success for url ***********", url);
    returnData = (await response.json()) as Kickinterface;
  }
  else {
    console.log('GETAPI RUNPLAY start', url);
    let response2: any;
    try {
      response2 = await fetch(url2);
      console.log('GETAPI RUNPLAY status', response2.status);
    } catch (error) {
      console.log('GETAPI RUNPLAY error', error, 'url2', url2);
    }
    // const response2 = await fetch(url2);
    if (response2 && response2.status === 200) {
      console.log('GETAPI RUNPLAY success **********');
      returnData = (await response2.json()) as Kickinterface;
    } else {
      console.log('GETAPI RUNPLAY error !!!!!!!!!!!');
      returnData = null;
    }
  }
  console.log ('//// GETAPI END');
  return returnData;
};
