const graphql = require('graphql');
const _ = require('lodash');

const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLID, GraphQLList } = graphql;

// dummy data
var books = [
    { name: 'Game of Thrones', genre: 'Action', id: '1', autherId: '1' },
    { name: 'Harry Potter', genre: 'Fiction', id: '2' , authorId: '2'},
    { name: 'Rise and Shine', genre: 'Funny', id: '3', authorId: '3' },
    { name: 'HaP', genre: 'Fiction', id: '4' , authorId: '1'},
    { name: 'Ris', genre: 'Funny', id: '5', authorId: '2' },
    { name: 'Qewe', genre: 'Fiction', id: '6' , authorId: '3'},
    { name: 'Fgh', genre: 'Funny', id: '7', authorId: '3' },
]

var authors = [
    { name: 'Michael', age: 34, id: '1' },
    { name: 'John', age: 55, id: '2' },
    { name: 'Dustin', age: 22, id: '3' },
]

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args){
                return _.find(authors, {id: parent.authorId})
            }
        }
    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return _.filter(books, {authorId: parent.id})
            }
        }
    })
})

// Root Query the entry point
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                // code to get data from db / other source
                return _.find(books, { id: args.id })
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args){
               return  _.find(authors, {id: args.id})
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args){
                return books
            }
        },
        authors: {
            type: GraphQLList(AuthorType),
            resolve(parent, args){
                return authors
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})
