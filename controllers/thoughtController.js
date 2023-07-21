const { User, Thought } = require("../models");

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await User.find();
      res.status(200).json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async getThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });
      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thought with that id found." });
      }
      res.status(200).json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async createThought(req, res) {
    try {
      const thoughtData = await Thought.findOne({ _id: req.params.thoughtId });
      const user = await User.findOneAndUpdate(
        { username: req.body.username },
        { $addToSet: { thoughts: thoughtData._id } },
        { new: true }
      );
      if (!user) {
        return res
          .status(404)
          .json({ message: "Thought created. No user with that id found." });
      }
      res.status(200).json({ message: "Thought created.", thoughtData });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async updateThought(req, res) {
    try {
      const thought = await Thought.findByIdAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { new: true }
      );
      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thought with that id found." });
      }
      res.status(200).json({ message: "Thought updated!", thought });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async deleteThought(req, res) {
    try {
      const deletedThought = await Thought.findByIdAndDelete({
        _id: req.params.thoughtId,
      });
      if (!deletedThought) {
        return res
          .status(404)
          .json({ message: "No thought with that id found." });
      }
      await User.updateMany(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } }
      );
      res.status(200).json({ message: "Thought deleted.", deletedThought });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async createReaction(req, res) {
    try {
      const { reactionBody, username } = req.body;
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $addToSet: { reactions: { reactionBody, username } } },
        { new: true }
      );
      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thought with that id found." });
      }
      res.status(200).json({ message: "Reaction created.", thought });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async deleteReaction(req, res) {
    try {
      const reactionId = req.body;
      const thought = await Thought.findByIdAndUpdate(
        req.params.thoughtId,
        { $pull: { reactions: reactionId } },
        { new: true }
      );
      if (!thought) {
        return res
          .status(404)
          .json({ message: "No thought with that id found." });
      }
      res.status(200).json({ message: "Reaction deleted.", thought });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
