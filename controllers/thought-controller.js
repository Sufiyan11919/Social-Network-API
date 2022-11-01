const {Thought, User} = require("../models");
// const User = requrie("../models");

const ThoughtController = {
getAllThoughts(req,res){
    Thought.find({}).populate({
        select:"-__v",
        path: "reactions"
    }).select("-__v")
    .then(data=> res.json(data))
    .catch(err => res.status(400).json(err));
},

getThoughtById({params}, res) {
Thought.findOne({ _id: params.thoughtId })
    .populate({
    path: 'reactions',
    select: '-__v'
    }).select('-__v')
    .then(data => {
    if(data) {
        res.json(data);
        return;
    }
    res.status(404).json({ message: 'No Thought found with this id' })
    })
    .catch(err => {
    res.status(400).json(err);
    });
},

createThought({body}, res) {
    Thought.create(body)
        .then(({ _id }) => {
        return User.findOneAndUpdate(
            { _id: body.userId },
            { $push: { thoughts: _id }},
            { new: true }
        );
        })
        .then(data => {
        if(data) {
            res.json(data);
            return;
        }
        res.status(404).json({ message: 'No Thoughts found with this id' });
        })
        .catch(err => res.json(err));
    },

updateThought({params, body}, res) {
    Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true, runValidators: true })
    .then(data => {
        if (data) {
            res.json(data);
            return;
        }
        res.status(404).json({ message: 'No User found with this id!' });
        })
    .catch(err => res.status(400).json(err));
    },
    
    
removeThought({params}, res) {
Thought.findOneAndDelete({ _id: params.thoughtId })
.then(({_id}) => {
    return User.findOneAndUpdate(
    { _id: params.userId },
    { $pull: { thoughts: _id }},
    { new: true }
    );
}).then(data => {
    if(data) {
        res.json("Successfully deleted");
        return 
    }
    res.status(404).json({ message: 'No thought found with this id' })
}).catch(err => res.json(err));
},



addReaction({params, body}, res) {
Thought.findOneAndUpdate(
    { _id: params.thoughtId },
    { $push: {reactions: body} },
    { new: true }
).then(data => {
    if (data) {
        res.json(data);
        return;
    }
    res.status(404).json({ message: 'No thought found with this id!' });
    }).catch(err => res.json(err));
},


removeReaction({ params }, res) {
Thought.findOneAndUpdate(
    { _id: params.thoughtId },
    { $pull: { reactions: { reactionId: params.reactionId } } },
    { new: true }
    ).then(data => {
    if(!data) {
        res.json(data);
        return 
    }
    res.status(404).json({ message: 'No reaction found!' })
    }).catch(err => res.json(err));
}
};

module.exports = ThoughtController;
