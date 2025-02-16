import { expect } from "playwright-test-coverage"

export const mockMenuResponse = async (route: any) => {
  const menuRes = [
    {
      id: 1,
      title: "Veggie",
      image: "pizza1.png",
      price: 0.0038,
      description: "A garden of delight",
    },
    {
      id: 2,
      title: "Pepperoni",
      image: "pizza2.png",
      price: 0.0042,
      description: "Spicy treat",
    },
    {
      id: 3,
      title: "Margarita",
      image: "pizza3.png",
      price: 0.0042,
      description: "Essential classic",
    },
    {
      id: 4,
      title: "Crusty",
      image: "pizza4.png",
      price: 0.0028,
      description: "A dry mouthed favorite",
    },
    {
      id: 5,
      title: "Charred Leopard",
      image: "pizza5.png",
      price: 0.0099,
      description: "For those with a darker side",
    },
  ]
  expect(route.request().method()).toBe("GET")
  await route.fulfill({ json: menuRes })
}

export const mockFranchiseResponse = async (route: any) => {
  const franchiseRes = [
    {
      id: 1,
      name: "Pizza Pocket",
      stores: [
        {
          id: 1,
          name: "SLC",
        },
        {
          id: 2,
          name: "Orem",
        },
      ],
    },
  ]
  expect(route.request().method()).toBe("GET")
  await route.fulfill({ json: franchiseRes })
}

export const mockLoginResponse = async (route: any) => {
  const loginReq = { email: "d@jwt.com", password: "diner" }
  const loginRes = {
    user: {
      id: 2,
      name: "pizza diner",
      email: "d@jwt.com",
      roles: [
        {
          role: "diner",
        },
      ],
    },
    token: "asdfjkl",
  }
  expect(route.request().method()).toBe("PUT")
  expect(route.request().postDataJSON()).toMatchObject(loginReq)
  await route.fulfill({ json: loginRes })
}

export const mockAdminLoginResponse = async (route: any) => {
  const loginReq = {
    email: "a@jwt.com",
    password: "admin",
  }
  const loginRes = {
    user: {
      id: 1,
      name: "常用名字",
      email: "a@jwt.com",
      roles: [
        {
          role: "admin",
        },
      ],
    },
    token: "fakeToken.fakeToken.fakeToken",
  }
  expect(route.request().method()).toBe("PUT")
  expect(route.request().postDataJSON()).toMatchObject(loginReq)
  await route.fulfill({ json: loginRes })
}

export const mockLogoutResponse = async (route: any) => {
  const logoutRes = {
    message: "logout successful",
  }
  expect(route.request().method()).toBe("DELETE")
  await route.fulfill({ json: logoutRes })
}

export const mockFranchiseLoginResponse = async (route: any) => {
  const loginReq = {
    email: "pp@jwt.com",
    password: "pizza pocket",
  }
  const loginRes = franchiseLoginObj
  expect(route.request().method()).toBe("PUT")
  expect(route.request().postDataJSON()).toMatchObject(loginReq)
  await route.fulfill({ status: 200, body: JSON.stringify(loginRes) })
}

export const mockAdminFranchiseResponse = async (route: any) => {
  const res = [
    {
      "id": 1,
      "name": "Pizza Pocket",
      "admins": [
        {
          "id": 3,
          "name": "pizza pocket owner",
          "email": "pp@jwt.com"
        }
      ],
      "stores": [
        {
          "id": 1,
          "name": "SLC",
          "totalRevenue": 0
        },
        {
          "id": 2,
          "name": "Orem",
          "totalRevenue": 0
        }
      ]
    }
  ]
  expect(route.request().method()).toBe("GET")
  await route.fulfill({ status: 200, body: JSON.stringify(res)})
}

export const mockCreateFranchiseResponse = async (route: any) => {
  const req = {
    "stores": [],
    "id": "",
    "name": "Biggie Cheese",
    "admins": [
      {
        "email": "a@jwt.com"
      }
    ]
  }
  const res = {
    "stores": [],
    "id": 6,
    "name": "Biggie Cheese",
    "admins": [
      {
        "email": "a@jwt.com",
        "id": 1,
        "name": "常用名字"
      }
    ]
  }
  expect(route.request().method()).toBe("POST")
  expect(route.request().postDataJSON()).toMatchObject(req)
  await route.fulfill({ status: 200, body: JSON.stringify(res)})
}

export const mockOrderResponse = async (route: any) => {
  const orderReq = {
    items: [
      {
        menuId: 1,
        description: "Veggie",
        price: 0.0038,
      },
      {
        menuId: 2,
        description: "Pepperoni",
        price: 0.0042,
      },
      {
        menuId: 3,
        description: "Margarita",
        price: 0.0042,
      },
    ],
    storeId: "1",
    franchiseId: 1,
  }
  const orderRes = {
    order: {
      items: [
        {
          menuId: 1,
          description: "Veggie",
          price: 0.0038,
        },
        {
          menuId: 2,
          description: "Pepperoni",
          price: 0.0042,
        },
        {
          menuId: 3,
          description: "Margarita",
          price: 0.0042,
        },
      ],
      storeId: "1",
      franchiseId: 1,
      id: 3,
    },
    jwt: "eyJpYXQ",
  }
  expect(route.request().method()).toBe("POST")
  expect(route.request().postDataJSON()).toMatchObject(orderReq)
  await route.fulfill({ json: orderRes })
}

export const mockRegisterResponse = async (route: any) => {
  const registerReq = {
    name: "geep gorp",
    email: "gg@jwt.com",
    password: "gg",
  }
  const registerRes = registerResponseObj
  expect(route.request().method()).toBe("POST")
  expect(route.request().postDataJSON()).toMatchObject(registerReq)
  await route.fulfill({ json: registerRes })
}

export const mockFranchiseByUserResponseBeforeDelete = async (
  route: any,
  page: any
) => {
  const res = [
    {
      id: 1,
      name: "Pizza Pocket",
      admins: [
        {
          id: 3,
          name: "pizza pocket owner",
          email: "pp@jwt.com",
        },
      ],
      stores: [
        {
          id: 1,
          name: "SLC",
          totalRevenue: 0.0324,
        },
        {
          id: 4,
          name: "Orem",
          totalRevenue: 0,
        },
      ],
    },
  ]
  expect(route.request().method()).toBe("GET")
  await route.fulfill({ json: res })
}

export const mockSecondAdminFranchiseResponse = async (route: any) => {
  const res = [
    {
      "id": 6,
      "name": "Biggie Cheese",
      "admins": [
        {
          "id": 1,
          "name": "常用名字",
          "email": "a@jwt.com"
        }
      ],
      "stores": []
    },
    {
      "id": 1,
      "name": "Pizza Pocket",
      "admins": [
        {
          "id": 3,
          "name": "pizza pocket owner",
          "email": "pp@jwt.com"
        }
      ],
      "stores": [
        {
          "id": 1,
          "name": "SLC",
          "totalRevenue": 0
        },
        {
          "id": 2,
          "name": "Orem",
          "totalRevenue": 0
        }
      ]
    }
  ]
  expect(route.request().method()).toBe("GET")
  await route.fulfill({ status: 200, body: JSON.stringify(res)})
}

export const mockFranchiseByUserResponseAfterDelete = async (route: any) => {
  const res = [
    {
      id: 1,
      name: "Pizza Pocket",
      admins: [
        {
          id: 3,
          name: "pizza pocket owner",
          email: "pp@jwt.com",
        },
      ],
      stores: [
        {
          id: 1,
          name: "SLC",
          totalRevenue: 0.0324,
        },
      ],
    },
  ]
  expect(route.request().method()).toBe("GET")
  await route.fulfill({ json: res })
}

export const mockDeleteStore = async (route: any) => {
  const res = {
    message: "store deleted",
  }
  expect(route.request().method()).toBe("DELETE")
  await route.fulfill({ json: res })
}

export const mockCreateStore = async (route: any) => {
  const req = {
    id: "",
    name: "New Orem",
  }
  const res = {
    id: 5,
    franchiseId: 1,
    name: "New Orem",
  }
  expect(route.request().method()).toBe("POST")
  expect(route.request().postDataJSON()).toMatchObject(req)
  await route.fulfill({ json: res })
}

export const registerResponseObj = {
  user: {
    name: "geep gorp",
    email: "gg@jwt.com",
    roles: [
      {
        role: "diner",
      },
    ],
    id: 5,
  },
  token: "faketoken.faketoken.faketoken",
}

export const franchiseLoginObj = {
  user: {
    id: 3,
    name: "pizza pocket owner",
    email: "pp@jwt.com",
    roles: [
      {
        role: "diner",
      },
      {
        objectId: 1,
        role: "franchisee",
      },
    ],
  },
  token: "faketoken.faketoken.faketoken",
}
