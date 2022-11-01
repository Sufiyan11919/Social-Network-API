const {User, Thought} = require("../models");

const userController = {
    getAllUsers(req,res){
        User.find({}).populate({
            select:"-__v",
            path: "thoughts"
        }).select("-__v")
        .then(data=> res.json(data))
        .catch(err => res.status(400).json(err));
    },
    
    getUserById({params}, res) {
    User.findOne({ _id: params.UserId })
        .populate({
        select: "-__v",
        path: "thoughts",
        })
        .populate({
            path: "friends",
            select: "-__v"
        })
        .select("-__v")
        .then(data => {
        if(data) {
            res.json(data);
            return;
        }
        res.status(404).json({ message: "No User found with this id" })
        })
        .catch(err => {
        res.status(400).json(err);
        });
    },


    createUser({body}, res) {
        User.create(body)
            .then(data => res.json(data))
            .catch(err => res.status(400).json(err));
    },
    
    updateUser({params, body}, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true, runValidators: true })
        .then(data => {
            if (data) {
                res.json(data);
                return;
            }
            res.status(404).json({ message: "No User found with this id!" });
            })
        .catch(err => res.status(400).json(err));
        },
        
        
    removeUser({params}, res) {
    User.findOneAndDelete({ _id: params.id })
    .then(data => {
        if(data) {
            res.json("Successfully deleted");
            return 
        }
        res.status(404).json({ message: "No User found with this id" })
    }).catch(err => res.json(err))

},


 addFriend({params}, res){
    User.findOneAndUpdate(
        {_id: params.userId },
        {$push: { friends: params.friendId }},
        {new: true, runValidators: true}
    )
    .then(data => {
        if(data){
            res.json(data);
            return;
        }
        res.status(404).json({ message: 'No User found with this id!' });
    })
    .catch(err => res.json(err));
},


removeFriend({params}, res){
    User.findOneAndUpdate(
        {_id: params.userId },
        {$pull: { friends: params.friendId }} ,
        {new: true}
    )
    .then(data => {
        res.json(data);
    })
    .catch(err => res.json(err));
}

}


    
    
    
      
module.exports = userController;
    