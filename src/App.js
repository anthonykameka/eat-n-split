import { useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

const App = () => {
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleShowAddFriend = () => {
    setShowAddFriend((show) => !show);
  };
  const handleAddFriend = (newFriend) => {
    setFriends([...friends, newFriend]);
    setShowAddFriend(false);
  };

  const handleSelection = (friend) => {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  };

  const handleSplitBill = (value) => {
    console.log(friends);
    console.log("test");
    setFriends((friends) => {
      return friends.map((friend) => {
        if (friend.id === selectedFriend.id) {
          return { ...friend, balance: friend.balance + value };
          // ^ Update the spread operator to spread the 'friend' object
        } else {
          return friend;
        }
      });
    });
    setSelectedFriend(null);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friends}
          selectedFriend={selectedFriend}
          onSelection={handleSelection}
        />

        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          key={selectedFriend.id}
          handleSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
};

const Button = ({ children, onClick }) => {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
};

const FriendsList = ({ friends, onSelection, selectedFriend }) => {
  return (
    <ul>
      {friends.map((friend) => {
        return (
          <Friend
            selectedFriend={selectedFriend}
            onSelection={onSelection}
            friend={friend}
            key={friend.id}
          />
        );
      })}
    </ul>
  );
};

const Friend = ({ friend, onSelection, selectedFriend }) => {
  const isSelected = selectedFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${friend.balance}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={() => onSelection(friend)}>
        {selectedFriend === friend ? "Close" : "Select"}
      </Button>
    </li>
  );
};

const FormAddFriend = ({ handleAddFriend }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name: name.charAt(0).toUpperCase() + name.slice(1),
      image: `${image}?=${id} `,
      balance: 0,
    };
    console.log(newFriend);

    handleAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  };

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friend name</label>
      <input
        value={name}
        type="text"
        onChange={(e) => setName(e.target.value)}
      />
      <label> 🖼️Image URL</label>
      <input
        value={image}
        type="text"
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
};

const FormSplitBill = ({ selectedFriend, handleSplitBill }) => {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const name = selectedFriend.name;
  const paidByFriend = bill ? bill - paidByUser : "";

  const handleExpenseChange = (e) => {
    const expense = Number(e.target.value);
    if (expense <= bill) {
      setPaidByUser(expense);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    handleSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  };

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a bill with {name}</h2>
      <label>💰Total Bill</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />
      <label>🧑‍🦲Your Expense</label>
      <input value={paidByUser} onChange={handleExpenseChange} type="number" />
      <label>🧑‍🤝‍🧑{name} Expense</label>
      <input type="number" value={paidByFriend} disabled />
      <label> 🤑Who is paying?</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{name}</option>
      </select>
      <Button>Split</Button>
    </form>
  );
};

export default App;
