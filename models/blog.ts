import { model, models, Schema, Types } from "mongoose";
import mongoose from "mongoose";

interface IBlog  {
  title: string;
  category: string;
  slug: string;
  author: Types.ObjectId; 
  tags?: string[];
  contentImage: string;
  cloudinaryId?: string; 
  thumbnailImage: string;
  content: string,
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
    category: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    tags: [{ type: String }],
    contentImage: {
      type: String,
      required: false
    },
    cloudinaryId: {
      type: String,
    },
    thumbnailImage: {
      type: String,
      required: true,
    },
    content: {
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
