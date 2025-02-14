import bcrypt from 'bcrypt';

const hashMiddleware = {
  query: {
    user: {
      async create({ args, query }: any) {
        if (args.data?.password) {
          args.data.password = await bcrypt.hash(args.data.password, 10);
        }
        return query(args);
      },
      async update({ args, query }: any) {
        if (args.data?.password && typeof args.data.password === 'string') {
          args.data.password = await bcrypt.hash(args.data.password, 10);
        }
        return query(args);
      },
    },
  },
};

export { hashMiddleware };
