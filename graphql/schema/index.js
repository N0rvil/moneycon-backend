const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type User {
    _id: ID!
    email: String!
    password: String
    balance: Int
}

type Record {
    _id: ID!
    type: String!
    category: String!
    amount: Int!
    date: String!
    creator: User!
}

type Category {
    _id: ID!
    name: String!
    color: String!
    creator: User!
}

type AuthData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
}

type session {
    _id: ID!
    token: String
    creator: User!
}


input UserInput {
    email: String!
    password: String!
}

input RecordInput {
    type: String!
    category: String!
    amount: Float!
    date: String!
}

input RecordEditInput {
    _id: ID!
    category: String!
    amount: Float!
}

input CategoryInput {
    name: String!
    color: String!
}

type RootQuery {
    login(email: String!, password: String!): AuthData!
    getSession(token: String!): session!
    getIncomeRecords: [Record!]
    getCategories: [Category!]
    getSingleRecord(recordId: ID!): Record!
}

type RootMutation {
    createUser(userInput: UserInput): User
    createRecord(recordInput: RecordInput): Record
    editRecord(recordInput: RecordEditInput): Record
    deleteRecord(recordId: ID!): Record
    createCategory(categoryInput: CategoryInput): Category
    deleteCategory(categoryId: ID!): [Category!]
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)