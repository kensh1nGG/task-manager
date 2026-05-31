import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// 1. Схема GraphQL (Book, Author)
const typeDefs = `#graphql
  type Author {
    id: ID!
    name: String!
    nationality: String!
    books: [Book!]! # Связь: у автора много книг
  }

  type Book {
    id: ID!
    title: String!
    year: Int!
    author: Author! # Связь: у книги есть автор
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
    authors: [Author!]!
  }

  type Mutation {
    createAuthor(name: String!, nationality: String!): Author!
    createBook(title: String!, year: Int!, authorId: ID!): Book!
  }
`;

// 2. Данные (в памяти)
let authors = [
  { id: '1', name: 'Лев Толстой', nationality: 'Russian' },
  { id: '2', name: 'Дж. К. Роулинг', nationality: 'British' }
];
let books = [
  { id: '1', title: 'Война и мир', year: 1869, authorId: '1' },
  { id: '2', title: 'Гарри Поттер', year: 1997, authorId: '2' }
];

// 3. Резолверы (Логика)
const resolvers = {
  Query: {
    books: () => books,
    book: (_, { id }) => books.find(b => b.id === id),
    authors: () => authors,
  },
  Mutation: {
    createAuthor: (_, { name, nationality }) => {
      const author = { id: String(authors.length + 1), name, nationality };
      authors.push(author);
      return author;
    },
    createBook: (_, { title, year, authorId }) => {
      const book = { id: String(books.length + 1), title, year, authorId };
      books.push(book);
      return book;
    },
  },
  // Вложенные резолверы для связей
  Author: {
    books: (parent) => books.filter(b => b.authorId === parent.id),
  },
  Book: {
    author: (parent) => authors.find(a => a.id === parent.authorId),
  },
};

// 4. Запуск сервера
const server = new ApolloServer({ typeDefs, resolvers });

const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
console.log(`🚀 GraphQL Server ready at: ${url}`);