'use strict';

const Joi = require('joi');
const uuid = require('uuid').v4;
const badrequest = Joi.object({
  statusCode: Joi.number().valid(400).required(),
  error: Joi.string().valid('Bad Request').required(),
  message: Joi.string().example('Bad Request')
}).label('Error');

const unauthorized = Joi.object({
  statusCode: Joi.number().valid(401).required(),
  error: Joi.string().valid('Unauthorized').required(),
  message: Joi.string().example('Missing authentication')
}).label('Error');

const precondition = Joi.object({
  statusCode: Joi.number().valid(412).required(),
  error: Joi.string().valid('Precondition Failed').required(),
  message: Joi.string().example('You do not have permission to view this item')
}).label('Error');

const notFound = Joi.object({
  statusCode: Joi.number().valid(404).required(),
  error: Joi.string().valid('Not Found').required(),
  message: Joi.string().example('That item does not exist')
}).label('Error');

const conflict = Joi.object({
  statusCode: Joi.number().valid(409).required(),
  error: Joi.string().valid('Conflict').required(),
  message: Joi.string().example('Item you are trying to create already exists')
}).label('Error');

const deprecated = Joi.object({
  statusCode: Joi.number().valid(410).required(),
  error: Joi.string().valid('Gone').required(),
  message: Joi.string().example('The client you are using is out of date, please update')
}).label('Error');

const code_lookup = {
  '400': {
    description: 'Bad Request',
    schema: badrequest
  },
  '401': {
    description: 'Missing or invalid authorization',
    schema: unauthorized
  },
  '412': {
    description: 'Invalid permissions',
    schema: precondition
  },
  '404': {
    description: 'Not found',
    schema: notFound
  },
  '409': {
    description: 'Conflict',
    schema: conflict
  },
  '410': {
    description: 'Gone',
    schema: deprecated
  }
};

exports.generate = (codes) => {

  const responses = {};
  if (!codes) {
    codes = ['401', '404', '409', '400'];
  }

  codes.forEach((code) => {

    responses[code] = code_lookup[code];
  });

  return { responses };
};

const public_user = Joi.object({
  name: Joi.string().optional().example('totally not a robot'),
  username: Joi.string().required().example('seriously'),
  email: Joi.string().required().example('real@email'),
  role: Joi.any().valid("mod", "user", "admin"),
  bio: Joi.string().optional().example('I am a real person')
});
const user = Joi.object({
  id: Joi.string().guid().example(uuid()),
  name: Joi.string().optional().example('totally not a robot'),
  username: Joi.string().required().example('seriously'),
  password: Joi.string().required().example('I am'),
  role: Joi.any().valid("mod", "user", "admin"),
  email: Joi.string().required().example('real@email'),
  bio: Joi.string().optional().example('I am a real person').allow(null),
  logout: Joi.date().optional().allow(null),
  created_at: Joi.date().optional().allow(null),
  updated_at: Joi.date().optional().allow(null),
});

const users = Joi.array().items(public_user).label('PublicUsers');
const private_users = Joi.array().items(user).label('PublicUsers');
exports.user_response = Joi.object({
  data: public_user
}).label('UserResponse');

exports.users_response = Joi.object({
  data: users
}).unknown().label('UsersResponse');

exports.private_response = Joi.object({
  data: user
}).unknown().label('PrivateResponse');

exports.private_users_response = Joi.object({
  data: private_users
}).unknown().label('PrivateResponse');

const itemowner = Joi.object({
  id: Joi.string().guid(),
  user_id: Joi.string().guid().required(),
  item_id: Joi.string().guid().required()
})

const item = Joi.object({
  id: Joi.number().example(3),
  name: Joi.string().required().example("name name"),
  location: Joi.string().optional().example("2710 Crimson Way, Richland, WA 99354"),
  type: Joi.any().valid("event", "place", "activity", "group"),
  start_date: Joi.date().optional().allow(null),
  end_date: Joi.date().optional().allow(null),
  starred_number: Joi.number().optional().allow(null),
  list_number: Joi.number().optional().allow(null),
  tag_name: Joi.string().optional().example("University").allow(null),
  created_at: Joi.date().timestamp().optional(),
  updated_at: Joi.date().timestamp().optional()
})
const additems = Joi.array().items(item).label('items');
exports.additem = {
  name: Joi.string().required(),
  location: Joi.string().required(),
  type: Joi.any().valid("activity", "place", "event", "group"),
  start_date: Joi.date().optional(),
  end_date: Joi.date().optional(),
}
const items = Joi.array().items(item).label('lists');

exports.item_response = Joi.object({
  data: item
}).unknown().label('ItemResponse');

exports.items_response = Joi.object({
  data: items
}).unknown().label('ItemsResponse');

const list = Joi.object({
  id: Joi.string().guid().example(uuid()),
  name: Joi.string().required().example('mon nom est'),
  description: Joi.string().required().example('description described descriptively').allow(null)
});

const lists = Joi.array().items(list).label('lists');

exports.list_response = Joi.object({
  data: list
}).label('ListResponse');

exports.lists_response = Joi.object({
  data: lists
}).label('ListsResponse');

const token = Joi.object({ token: [Joi.string().example("eyJhbGciOiJIUzI1NiJ9.eyJpZCI6ImJiZWZkYjBhLTc2YjAtNGQ5Yy05NDkwLTk3Y2YxMWJjMWE5YyIsIm5hbWUiOiJMZWlnaCIsInVzZXJuYW1lIjoiTFYiLCJlbWFpbCI6Imx2QGVtYWlsLmNvbSIsInBhc3N3b3JkIjoicCIsImJpbyI6IkJvc3MgbGFkeSIsInJvbGUiOiJ1c2VyIiwibG9nb3V0IjoiMjAxNy0xMS0yOVQyMTo1ODo1MC45MDFaIiwiY3JlYXRlZF9hdCI6IjIwMTctMTEtMjlUMjE6NTg6NTAuODk5WiIsInVwZGF0ZWRfYXQiOiIyMDE3LTExLTI5VDIxOjU4OjUwLjg5OVoifQ.u--F_TonmKdpftsjxjDRK2TVlLCfGZqSkyQhTnPeA3U"), Joi.number()] })

exports.login_response = Joi.object({
  data: token
}).unknown().label('loginResponse')

exports.user_update_repsonse = Joi.object({
  data: {user: user,token: [Joi.string().example("eyJhbGciOiJIUzI1NiJ9.eyJpZCI6ImJiZWZkYjBhLTc2YjAtNGQ5Yy05NDkwLTk3Y2YxMWJjMWE5YyIsIm5hbWUiOiJMZWlnaCIsInVzZXJuYW1lIjoiTFYiLCJlbWFpbCI6Imx2QGVtYWlsLmNvbSIsInBhc3N3b3JkIjoicCIsImJpbyI6IkJvc3MgbGFkeSIsInJvbGUiOiJ1c2VyIiwibG9nb3V0IjoiMjAxNy0xMS0yOVQyMTo1ODo1MC45MDFaIiwiY3JlYXRlZF9hdCI6IjIwMTctMTEtMjlUMjE6NTg6NTAuODk5WiIsInVwZGF0ZWRfYXQiOiIyMDE3LTExLTI5VDIxOjU4OjUwLjg5OVoifQ.u--F_TonmKdpftsjxjDRK2TVlLCfGZqSkyQhTnPeA3U"), Joi.number()]}
})
const list_items = Joi.array().items(item).label('listItems')

//const favorite_list = Joi.array().items(item).label('favoriteList');

exports.get_user_response = Joi.object({
  data: { user: public_user, favorite_list: list_items }
})
exports.favorite_list_response = Joi.object({
  data: list_items
})
exports.list_items_response = Joi.object({
  data: list_items
})