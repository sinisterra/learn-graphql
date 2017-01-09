const {GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLBoolean, GraphQLEnumType} = require('graphql')
const {connectionDefinitions, connectionArgs, connectionFromArray, connectionFromPromisedArray} = require('graphql-relay');

const QuoteType = new GraphQLObjectType({
  name: 'Quote',
  fields: {
    id: {
      type: GraphQLString,
      resolve: object => object._id
    },
    text: {
      type: GraphQLString
    },
    author: {
      type: GraphQLString
    }
  }
})

const {connectionType: QuotesConnectionType} = connectionDefinitions({
  name: 'Quote',
  nodeType: QuoteType
})


let connectionArgsWithSearch = connectionArgs;
connectionArgsWithSearch.searchTerm = {
  type: GraphQLString
}

const QuotesLibraryType = new GraphQLObjectType({
  name: 'QuotesLibrary',
  fields: {
    quotesConnection: {
      type: QuotesConnectionType,
      description: 'A list of the quotes in the database',
      args: connectionArgsWithSearch,
      resolve: (_, args, {db}) => {
        let findParams = {};
        if (args.searchTerm) {
          findParams.text = new RegExp(args.searchTerm, 'i');
        }
        return connectionFromPromisedArray(
          db.collection('quotes').find(findParams).toArray(),
          args
        );
      }
    }
  }
});

const quotesLibrary = {}
const queryType = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    quotesLibrary: {
      type: QuotesLibraryType,
      description: 'Some quotes',
      resolve: () => quotesLibrary
    },
    usersCount: {
      description: 'Total de usuarios a la bd',
      type: GraphQLInt,
      resolve: (_, args, {db}) => db.collection('users').count()
    }
  }
})

const mySchema = new GraphQLSchema({
  query: queryType
})

module.exports = mySchema