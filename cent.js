/* eslint-disable */
// ==UserScript==
// @name         cent
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-end
// @require      file:///C:/Users/PatrykDudzinski/Code/cent.js
// @noframes
// ==/UserScript==

(async () => {
  // console.log('start');
  // const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  // await sleep(2000);
  let toReturn = '';
  // let count_before = await GM.getValue('count', 0);
  // // Note awaiting the set -- required so the next get sees this set.
  // await GM.setValue('count', count_before + 1);
  // // Get the value again, just to demonstrate order-of-operations.
  // let count_after = await GM.getValue('count');
  // console.log('Greasemonkey set-and-get Example has run', count_after, 'times');
  if (
    window.location.href == 'http://centreon.polcom/centreon/main.php?p=103'
  ) {
    let p = document.createElement('p');
    const urls = [
      'http://centreon.polcom/centreon/widgets/service-monitoring/src/index.php?widgetId=3&page=0',
      'http://centreon.polcom/centreon/widgets/service-monitoring/src/index.php?widgetId=3&page=1',
    ];
    Promise.all(
      urls.map((url, index) => fetch(url).then((response) => response.text()))
    ).then((texts) => {
      texts.forEach((text, index) => {
        p.innerHTML = text;
        let formattedArr = Array.from(
          p.querySelectorAll('.list_one, .list_two')
        ).map((val) =>
          Array.from(val.cells)
            .map((cell) => cell.textContent.trim())
            .filter((val) => val !== '')
        );

        //fixes no host when centreon groups
        //if host is not specified get hostname from previous resource
        const fixNoHostArr = formattedArr
          .map((val, i) => {
            if (val.length === 6) {
              // console.log(val);
              return [formattedArr[i - 1][0], ...val];
            }
            return val;
          })
          .map((val) => [...val, 'DCA']);
        toReturn = [...toReturn, ...fixNoHostArr];

        // Now you have access to the index of the URL
        console.log(`Processing text from URL at index ${index}`);

        // do something with fixNoHostArr
      });
      console.log(toReturn);

      console.log(JSON.stringify(toReturn));
      GM.setValue('DCAcom', JSON.stringify(toReturn));
    });

    // p.className = 'helphelp';
    // console.log(p);
    // console.log('fetch');
    // console.log(window.location);
    // console.log(window.location.href);
    // console.log(window.location.hostname);
    const result = fetch(
      'http://centreon.polcom/centreon/widgets/service-monitoring/src/index.php?widgetId=3&page=0'
    );
    result.then((value) => {
      value.text().then((v) => {
        p.innerHTML = v;
        let formattedArr = Array.from(
          p.querySelectorAll('.list_one, .list_two')
        ).map((val) =>
          Array.from(val.cells)
            .map((cell) => cell.textContent.trim())
            .filter((val) => val !== '')
        );

        //fixes no host when centreon groups
        //if host is not specified get hostname from previous resource
        const fixNoHostArr = formattedArr.map((val, i) => {
          if (val.length === 6) {
            // console.log(val);
            return [formattedArr[i - 1][0], ...val];
          }
          return val;
        });

        // arr of hostnames:Service (not returning currently due to problems with gm.setvalue acepting only strings, moved this to displayer)
        // const newCollection = fixNoHostArr.reduce((obj, item) => {
        //   obj[item[0] + ':' + item[1]] = item;
        //   return obj;
        // }, {});
        // GM_SuperValue.set('DCA', newCollection);
        console.log(fixNoHostArr);
        GM.setValue('DCA', JSON.stringify(fixNoHostArr));
        console.log(JSON.stringify(fixNoHostArr));
        // console.log(formattedArr);
        // console.log(JSON.stringify(formattedArr));
      });
    });
  }
  if (
    window.location.href ==
    'file:///C:/Users/PatrykDudzinski/Code/display/index.html'
  ) {
    // const arr = await GM.getValue('DCA').then((val) => JSON.parse(val));
    const check = await GM.getValue('DCAcom');
    console.log(check);
    document.getElementById('holder').value = check;
    
    const arr = await GM.getValue('DCAcom').then((val) => JSON.parse(val));
    console.log(arr);

    const elements = arr.map((val) => `<p>${val}</p>`).join('');
    console.log(elements);
    const x = document.createElement('div');
    x.innerHTML = elements;
    console.log(x);
    document.getElementById('root').appendChild(x);

    let p = document.createElement('p');
    p.appendChild(x);
    console.log(p);
    document.getElementById('root').appendChild(p);
    // GM_SuperValue.get('DCA', newCollection);
  }
  // .then(() => {
  //   console.log('before root element');
  //   document.getElementById('root').append(p);
  // })
  // .then(() => sleep(3000))
  // .then(() => {
  //   console.log('Inside last then');
  //   console.log(document.getElementsByClassName('helphelp')[0].innerHTML);
  //   console.log(
  //     Array.from(
  //       document
  //         .getElementsByClassName('helphelp')[0]
  //         .querySelectorAll('.list_one, .list_two')
  //     ).map((val) =>
  //       Array.from(val.cells)
  //         .map((cell) => cell.textContent.trim())
  //         .filter((val) => val !== '')
  //     )
  //   );
  // });

  //   let root = document.getElementById('root');

  //   console.log(root);
  //   document.getElementById('serviceMonitoringTable').appendChild(p);
  //   console.log(p);

  //   console.log(test);

  //   if ('loading' == document.readyState) {
  //     alert('This script is running at document-start time.');
  //   } else {
  //     alert(
  //       'This script is running with document.readyState: ' + document.readyState
  //     );
  //   }
})();
