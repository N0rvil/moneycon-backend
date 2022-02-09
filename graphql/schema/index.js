const { buildSchema } = require('graphql');

module.exports = buildSchema(`
type User {
    _id: ID!
    email: String!
    password: String
    balance: Int
    currency: String
}

type Record {
    _id: ID!
    type: String!
    category: String!
    amount: Int!
    date: String!
    toBalance: Int!
    creator: User!
}

type Category {
    _id: ID!
    name: String!
    color: String!
    type: String!
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
    type: String!
}

input DeleteCategoryInput {
    id: ID!
    type: String!
}

input ChangeCurrencyInput {
    currency: String!
}

input ChangePasswordInput {
    oldPassword: String!
    newPassword: String!
}

type RootQuery {
    login(email: String!, password: String!): AuthData!
    getSession(token: String!): session!
    getIncomeRecords: [Record!]
    getSpendingsRecords: [Record!]
    getIncomeCategories: [Category!]
    getSpendingsCategories: [Category!]
    getSingleRecord(recordId: ID!): Record!
    getLastMonthRecords: [Record!]
}

type RootMutation {
    createUser(userInput: UserInput): User
    createRecord(recordInput: RecordInput): Record
    editRecord(recordInput: RecordEditInput): Record
    deleteRecord(recordId: ID!): Record
    createCategory(categoryInput: CategoryInput): Category
    deleteCategory(deleteCategoryInput: DeleteCategoryInput): [Category!]
    changeCurrency(changeCurrencyInput: ChangeCurrencyInput): User
    changePassword(changePasswordInput: ChangePasswordInput): User
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)