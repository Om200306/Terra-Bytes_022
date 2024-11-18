import { v } from "convex/values";
import { mutation, query } from "./_generated/server";





export const remove = mutation({
    args: { id: v.id('documents') },
    handler: async (context, args) => {
      const identity = await context.auth.getUserIdentity();
  
      if (!identity) {
        throw new Error('Not authenticated');
      }
  
      const userId = identity.subject;
  
      const existingDocument = await context.db.get(args.id);
  
      if (!existingDocument) {
        throw new Error('Not found');
      }
  
      if (existingDocument.userId !== userId) {
        throw new Error('Unauthorized');
      }
  
      const document = await context.db.delete(args.id);
  
      return document;
    }
  });
  
  


export const restore = mutation({
    args: { id: v.id('documents') },
    handler: async (context, args) => {
      const identity = await context.auth.getUserIdentity();
  
      if (!identity) {
        throw new Error('Not authenticated');
      }
  
      const userId = identity.subject;
  
      const existingDocument = await context.db.get(args.id);
  
      if (!existingDocument) {
        throw new Error('Not found');
      }
  
      if (existingDocument.userId !== userId) {
        throw new Error('Unauthorized');
      }
  
      const recursiveRestore = async (documentId) => {
        const children = await context.db.query('documents')
          .withIndex('by_user_parent', (q) => (
            q.eq('userId', userId).eq('parentDocument', documentId)
          ))
          .collect();
  
        for (const child of children) {
          await context.db.patch(child._id, {
            isArchived: false
          });
  
          await recursiveRestore(child._id);
        }
      };
  
      const options = {
        isArchived: false
      };
  
      if (existingDocument.parentDocument) {
        const parent = await context.db.get(existingDocument.parentDocument);
        if (parent?.isArchived) {
          options.parentDocument = undefined;
        }
      }
  
      const document = await context.db.patch(args.id, options);
  
      recursiveRestore(args.id);
  
      return document;
    }
  });
  

export const getTrash = query({
    handler: async (context) => {
      const identity = await context.auth.getUserIdentity();
  
      if (!identity) {
        throw new Error('Not authenticated');
      }
  
      const userId = identity.subject;
  
      const documents = await context.db.query('documents')
        .withIndex('by_user', (q) => q.eq('userId', userId))
        .filter((q) => q.eq(q.field('isArchived'), true))
        .order('desc')
        .collect();
  
      return documents;
    }
  });
  


export const archive = mutation({
    args: { id: v.id("documents") },
    handler: async (context, args) => {
      const identity = await context.auth.getUserIdentity();
  
      if (!identity) {
        throw new Error("Not authenticated");
      }
  
      const userId = identity.subject;
  
      const existingDocument = await context.db.get(args.id);
  
      if (!existingDocument) {
        throw new Error('Not found');
      }
  
      if (existingDocument.userId !== userId) {
        throw new Error("Unauthorized");
      }
  
      // Recursive function to archive child documents
      const recursiveArchive = async (documentId) => {
        const children = await context.db
          .query('documents')
          .withIndex("by_user_parent", (q) => q.eq("userId", userId).eq('parentDocument', documentId))
          .collect();
  
        // Archive each child document and recursively archive its children
        for (const child of children) {
          await context.db.patch(child._id, {
            isArchived: true
          });
          await recursiveArchive(child._id);  // Recursively archive the child
        }
      };
  
      // Start by archiving the main document
      const document = await context.db.patch(args.id, {
        isArchived: true
      });
  
      // Recursively archive all child documents
      await recursiveArchive(args.id);  // Ensure that this is awaited
  
      return document;
    }
  });
  


export const getSidebar = query({
    args:{
      parentDocument:v.optional(v.id("documents"))
    },
    handler:async (context,args) => {
      const identity = await context.auth.getUserIdentity()
  
      if (!identity) {
        throw new Error("Not authenticated")
      }
  
      const userId = identity.subject
  
      const documents = await context.db
      .query("documents")
      .withIndex("by_user_parent",(q) => q.eq('userId',userId)
      .eq('parentDocument',args.parentDocument))
      .filter(q => q.eq(q.field("isArchived"),false))
      .order('desc')
      .collect()
  
      return documents
    }
  })

export const get=query({
    handler:async(ctx)=>{
        const identity=await ctx.auth.getUserIdentity();
        if(!identity){
            throw new Error("Unauthenticated");
        }

        const documents=await ctx.db.query("documents").collect();
        return documents;
    }
})

export const create = mutation({
    args: {
        title: v.string(),
        parentDocument: v.optional(v.id("documents"))
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Unauthenticated");
        }
        const userId = identity.subject;
        const document = await ctx.db.insert("documents", {
            title: args.title,
            parentDocument: args.parentDocument,
            userId,
            isArchived: false,
            isPublished: false,
        });
        return document;
    }
});
