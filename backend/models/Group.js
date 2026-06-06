import mongoose from 'mongoose';

const groupSchema = mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
    },
    groupImage: {
      type: String,
      default: '',
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Group = mongoose.model('Group', groupSchema);
export default Group;
