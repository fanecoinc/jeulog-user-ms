import bcrypt from 'bcrypt';

const hashMiddleware = {
  query: {
    user: {
      $allOperations({ operation, args, query }: any) {
        if (['create', 'update'].includes(operation) && args.data['password']) {
          args.data['password'] = bcrypt.hashSync(args.data['password'], 10);
        }
        return query(args);
      },
    },
  },
};

export { hashMiddleware };
