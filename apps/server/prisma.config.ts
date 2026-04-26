import 'dotenv/config';
import {defineConfig, env} from 'prisma/config';

export default defineConfig({

  schema : './prisma/schema.prisma',

  datasource : {
     url : env('DATABASE_URL'),

     // for neon postgres connection pooling 

     shadowDatabaseUrl : env('DIRECT_URL'),
  },

  migrations : {
     path : 'prisma/migrations',
  }
});




