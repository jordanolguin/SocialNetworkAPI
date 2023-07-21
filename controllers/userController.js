const { User, Thought } = require("../models");

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async getUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
        .populate("thoughts")
        .populate("friends");
      if (!user) {
        return res.status(404).json({ message: "No user with that id found." });
      }
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateUser(req, res) {
    try {
      const user = await User.findByIdAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "No user with that id found." });
      }
      res.status(200).json({ message: "User updated!", user });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async deleteUser(req, res) {
    try {
      const deletedUser = await User.findByIdAndDelete({
        _id: req.params.userId,
      });
      if (!deletedUser) {
        return res.status(404).json({ message: "No user with that id found." });
      }
      await Thought.deleteMany({ _id: { $in: deletedUser.thoughts } });
      res.status(200).json({ message: "User and thoughts deleted." });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async createFriend(req, res) {
    try {
      const { userId, friendId } = req.params;
      const user = await User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { friends: friendId } },
        { new: true }
      );
      const friend = await User.findById(friendId);

      if (!user || !friend) {
        return res.status(400).json({ message: "No user with that id found." });
      }
      res
        .status(200)
        .json({ message: "Friend added!", friend: friend.username, user });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  async deleteFriend(req, res) {
    try {
      const { userId, friendId } = req.params;
      const user = await User.findOneAndUpdate(userId);
      if (!user) {
        return res.status(404).json({ message: "No user with that id found." });
      }
      const isFriend = user.friends.includes(friendId);
      if (!isFriend) {
        return res.status(404).json({ message: "Friend not found." });
      }
      user.friends = user.friends.filter(
        (friend) => friend.toString() !== friendId
      );
      await user.save();

      res.status(200).json({ message: "Friend deleted.", user });
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
