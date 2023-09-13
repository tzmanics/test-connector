// Documentation: https://sdk.netlify.com
import { NetlifyIntegration } from "@netlify/sdk";

const integration = new NetlifyIntegration();
const connector = integration.addConnector({
  typePrefix: "Example",
});

/**
 * Define your content models here.
 * https://sdk.netlify.com/connectors/connector-apis/#model
 */
connector.model(async ({ define }) => {
  define.nodeModel({
    name: "User",
    fields: {
      name: {
        type: "String",
        required: true,
      },
      posts: {
        type: "Post",
        list: true,
      },
    },
  });

  define.nodeModel({
    name: "Post",
    fields: {
      title: {
        type: "String",
        required: true,
      },
      blocks: {
        list: true,
        required: true,
        type: define.object({
          name: "Blocks",
          fields: {
            title: {
              type: "String",
            },
            content: {
              type: "String",
            },
          },
        }),
      },
    },
  });
});

/**
 * Fetch and store data from your API here.
 * https://sdk.netlify.com/connectors/connector-apis/#createallnodes
 */
connector.event("createAllNodes", ({ models }) => {
  models.User.create({
    id: "1",
    name: "Annie",
    posts: [
      {
        id: "1",
        __typename: "Post",
      },
    ],
  });
  models.Post.create({
    id: "1",
    title: "Hello World",
    blocks: [
      {
        title: "Example block title",
        content: "You can create complex content models",
      },
    ],
  });
});

/**
 * Fetch and store changed data from your API here.
 * https://sdk.netlify.com/connectors/connector-apis/#updatenodes
 */
connector.event("updateNodes", ({ models }) => {
  models.User.create({
    id: "1", // overwrites the existing User node with this ID
    name: "Annie",
    posts: [
      {
        id: "1",
        __typename: "Post",
      },
    ],
  });
  models.Post.create({
    id: "2", // creates a new Post since this ID doesn't exist yet
    title: "Writing lots of posts these days",
    blocks: [
      {
        title: "Page section",
        content: "what up",
      },
    ],
  });
});

integration.onEnable(async (_, { teamId, siteId, client }) => {
  // Connectors are disabled by default, so we need to
  // enable them when the integration is enabled.
  
  teamId && await client.enableConnectors(teamId);
  
  return {
    statusCode: 200,
  };
});

export { integration };

