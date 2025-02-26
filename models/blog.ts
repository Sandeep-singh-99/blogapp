import { model, models, Schema, Document, Types } from "mongoose";

interface IBlog extends Document {
  title: string;
  content: string;
  slug: string;
  author: Types.ObjectId; 
  tags?: string[];
  profileImage: string;
  cloudinaryId?: string; 
  featuredImage: string;
  markdown: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    tags: [{ type: String }],
    profileImage: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
    },
    featuredImage: {
      type: String,
      required: true,
    },
    markdown: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


blogSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") 
      .replace(/^-+|-+$/g, ""); 
  }
  next();
});

const BlogModel = models.Blog || model<IBlog>("Blog", blogSchema);

export default BlogModel;

export type { IBlog };
