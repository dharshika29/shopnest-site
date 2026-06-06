import mongoose from 'mongoose';

const messageSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // For direct messages
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Group',
      required: false, // For group messages
    },
    text: {
      type: String,
      default: '',
    },
    media: {
      type: String,
      default: '',
    },
    seen: {
      type: Boolean,
      default: false,
    },
    delivered: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
