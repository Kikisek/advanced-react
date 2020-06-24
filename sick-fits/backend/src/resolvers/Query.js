const { forwardTo } = require("prisma-binding");
const { hasPermission } = require("../utils");

const Query = {
  items: forwardTo("db"),
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  me(parent, args, ctx, info) {
    // check if there is a current userID
    if (!ctx.request.userId) {
      return null;
    }
    return ctx.db.query.user(
      {
        where: { id: ctx.request.userId },
      },
      info
    );
  },
  async users(parent, args, ctx, info) {
    // Check if they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in");
    }
    // Check if the user has the permissions to query all the users
    hasPermission(ctx.request.user, ["ADMIN", "PERMISSIONUPDATE"]);
    // Query all the users
    return ctx.db.query.users({}, info);
  },
  async order(parent, args, ctx, info) {
    // Make sure they are logged in
    if (!ctx.request.userId) {
      throw new Error("You must be logged in");
    }
    // Query the current order
    const order = await ctx.db.query.order(
      {
        where: { id: args.id },
      },
      info
    );
    // Check if they have the permission to see this order
    const ownsOrder = order.user.id === ctx.request.userId;
    const hasPermissionToSeeOrder = ctx.request.user.permissions.includes(
      "ADMIN"
    );
    if (!ownsOrder || !hasPermissionToSeeOrder) {
      throw new Error("You cannot see this");
    }
    // Return the order
    return order;
  },
  async orders(parent, args, ctx, info) {
    const { userId } = ctx.request;
    if (!userId) throw new Error("You need to be logged in");
    return await ctx.db.query.orders({
      where: {
        user: { id: userId },
      },
    }, info);
  },
};

module.exports = Query;
