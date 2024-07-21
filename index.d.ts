declare module 'koa' {
  interface DefaultContext extends StrapiContext {}
}

interface StrapiContext {
  // Declare any additional properties or methods you want to add to the Context object.
  // For example, if you have a custom service in your Strapi API, you can add its type here.
  myCustomService: MyCustomService;
}
