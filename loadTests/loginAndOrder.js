import { sleep, check, group, fail } from 'k6'
import http from 'k6/http'

export const options = {
  cloud: {
    distribution: { 'amazon:us:ashburn': { loadZone: 'amazon:us:ashburn', percent: 100 } },
    apm: [],
  },
  thresholds: {},
  scenarios: {
    Scenario_1: {
      executor: 'ramping-vus',
      gracefulStop: '30s',
      stages: [
        { target: 5, duration: '30s' },
        { target: 15, duration: '1m' },
        { target: 10, duration: '30s' },
        { target: 0, duration: '30s' },
      ],
      gracefulRampDown: '30s',
      exec: 'scenario_1',
    },
  },
}

export function scenario_1() {
  let response
  const vars = {}

  group('page_1 - https://pizza.mcghie-blake.com/', function () {
    // Home Page
    response = http.get('https://pizza.mcghie-blake.com/', {
      headers: {
        Host: 'pizza.mcghie-blake.com',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Sec-GPC': '1',
        Connection: 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        Priority: 'u=0, i',
        'Cache-Control': 'no-cache',
      },
    })
    sleep(6.6)

    // Login
    response = http.put(
      'https://pizza-service.mcghie-blake.com/api/auth',
      '{"email":"tu@jwt.com","password":"testtest"}',
      {
        headers: {
          Host: 'pizza-service.mcghie-blake.com',
          Accept: '*/*',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Content-Type': 'application/json',
          Origin: 'https://pizza.mcghie-blake.com',
          'Sec-GPC': '1',
          Connection: 'keep-alive',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          Priority: 'u=0',
        },
      }
    )

    if (!check(response, { 'status equals 200': response => response.status.toString() === '200' })) {
      console.log(response.body)
      fail('Login was *not* 200')
    }
    vars.authToken = response.json().token

    sleep(10.3)

    // List Menu
    response = http.get('https://pizza-service.mcghie-blake.com/api/order/menu', {
      headers: {
        Host: 'pizza-service.mcghie-blake.com',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Content-Type': 'application/json',
        Authorization:
          `Bearer ${vars.authToken}`,
        Origin: 'https://pizza.mcghie-blake.com',
        'Sec-GPC': '1',
        Connection: 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'If-None-Match': 'W/"1fc-cgG/aqJmHhElGCplQPSmgl2Gwk0"',
        Priority: 'u=0',
        TE: 'trailers',
      },
    })

    // List Franchise
    response = http.get('https://pizza-service.mcghie-blake.com/api/franchise', {
      headers: {
        Host: 'pizza-service.mcghie-blake.com',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Content-Type': 'application/json',
        Authorization:
          `Bearer ${vars.authToken}`,
        Origin: 'https://pizza.mcghie-blake.com',
        'Sec-GPC': '1',
        Connection: 'keep-alive',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'If-None-Match': 'W/"94-NbB6NJ+uIVyNAipgiaICa2eyRo8"',
        Priority: 'u=4',
        TE: 'trailers',
      },
    })

    sleep(11.7)

    // Make Order
    response = http.post(
      'https://pizza-service.mcghie-blake.com/api/order',
      '{"items":[{"menuId":1,"description":"Veggie","price":0.0038},{"menuId":2,"description":"Pepperoni","price":0.0042},{"menuId":3,"description":"Margarita","price":0.0042},{"menuId":4,"description":"Crusty","price":0.0028},{"menuId":5,"description":"Charred Leopard","price":0.0099}],"storeId":"2","franchiseId":2}',
      {
        headers: {
          Host: 'pizza-service.mcghie-blake.com',
          Accept: '*/*',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Content-Type': 'application/json',
          Authorization:
            `Bearer ${vars.authToken}`,
          Origin: 'https://pizza.mcghie-blake.com',
          'Sec-GPC': '1',
          Connection: 'keep-alive',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'same-site',
          Priority: 'u=0',
          TE: 'trailers',
        },
      }
    )

    if (!check(response, { 'status equals 200': response => response.status.toString() === '200' })) {
      console.log(response.body)
      fail('Order Pizza was *not* 200')
    }
    vars.jwt = response.json().jwt

    sleep(6.6)

    // Verify JWT
    response = http.post(
      'https://pizza-factory.cs329.click/api/order/verify',
      `{"jwt":"${vars.jwt}"}`,
      {
        headers: {
          Host: 'pizza-factory.cs329.click',
          Accept: '*/*',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br, zstd',
          'Content-Type': 'application/json',
          Authorization:
            `Bearer ${vars.authToken}`,
          Origin: 'https://pizza.mcghie-blake.com',
          'Sec-GPC': '1',
          Connection: 'keep-alive',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site',
          Priority: 'u=0',
        },
      }
    )

  })
}
