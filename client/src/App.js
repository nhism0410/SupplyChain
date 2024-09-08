import React, { Component } from "react";
import axios from "axios";
import getWeb3 from "./getWeb3";
import Main from "./components/Main/Main";
import ItemManagerContracts from "./contracts/ItemManager.json";
import ItemContract from "./contracts/Item.json";
import "./App.css";
class App extends Component {
  state = {
    loaded: false,
    items: [],
    currentView: 'home',
    cost: '',
    itemName: '',
    category: '',
    account: '',
    categories: []
  };

  componentDidMount = async () => {
    try {
      this.web3 = await getWeb3();
      this.accounts = await this.web3.eth.getAccounts();
      this.setState({ account: this.accounts[0] });
      this.networkId = await this.web3.eth.net.getId();

      this.itemManager = new this.web3.eth.Contract(
        ItemManagerContracts.abi,
        ItemManagerContracts.networks[this.networkId] &&
          ItemManagerContracts.networks[this.networkId].address
      );

      this.item = new this.web3.eth.Contract(
        ItemContract.abi,
        ItemContract.networks[this.networkId] &&
          ItemContract.networks[this.networkId].address
      );

      this.listenToPaymentEvent();
      this.loadItems();
      this.setState({ loaded: true });
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', this.handleAccountsChanged);
      }
    } catch (error) {
      alert("Failed to load web3, accounts, or contract. Check console for details.");
      console.error(error);
    }
  };
  componentWillUnmount() {
    if (window.ethereum) {
      window.ethereum.removeListener('accountsChanged', this.handleAccountsChanged);
    }
  }

  handleAccountsChanged = async (accounts) => {
    if (accounts.length === 0) {
      console.log("No accounts found");
    } else {
      this.setState({ account: accounts[0] });
      // Reload the entire page
      window.location.reload();
    }
  };

  listenToPaymentEvent = () => {
    this.itemManager.events.SupplyChainStep().on("data", async (evt) => {
      console.log(evt);
      let itemObject = await this.itemManager.methods
        .items(evt.returnValues._itemIndex)
        .call();
      if (itemObject._state === "1") { // Updated state to string
        alert("Item " + itemObject._identifier + " was paid, deliver it now");
      }
    });
  };

  loadItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/items');
      // Check the structure of the response
      console.log('Loaded items:', response.data);
      this.setState({ items: response.data });
    } catch (error) {
      console.error('Error loading items from backend:', error);
    }
  };
  

  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({ [name]: value });
  };

// App.js
handleSubmit = async (category ) => {
  const { cost, itemName } = this.state;

  try {
    const result = await this.itemManager.methods.createItem(itemName, cost, category).send({ from: this.accounts[0] });
    alert(`Send ${cost} Wei to ${result.logs[0].address}`);
    const itemAddress = result.events.SupplyChainStep.returnValues._itemAddress;
    const itemIndex = Number(result.events.SupplyChainStep.returnValues._itemIndex);
    
    console.log("ItemIndex:", itemIndex);
    const itemData = {
      name: itemName,
      cost: cost,
      category: category, // Add category here
      fromAddress: this.accounts[0],
      toAddress: result.logs[0].address,
      itemAddress: itemAddress,
      hash: result.transactionHash,
      status: "Create",
      contractIndex: itemIndex
    };

    const response = await axios.post("http://localhost:5000/api/items/add", itemData);
    console.log("Item added to backend:", response.data);
    this.loadItems();
  } catch (error) {
    console.error("Error adding item:", error);
  }
};

// Call setItemCategory when updating category
handleUpdateCategory = async (itemId, category) => {
  try {
    await this.itemManager.methods.setItemCategory(itemId, category).send({ from: this.accounts[0] });
    const itemData = {
      index: itemId,
      category // Cập nhật danh mục sản phẩm
    };

    await axios.post("http://localhost:5000/api/items/update", itemData);
    alert('Item category updated successfully');
    this.loadItems();
  } catch (error) {
    console.error("Error updating item category:", error.message);
    alert(`Error updating item category: ${error.message}`);
  }
};


  handleBuyItem = async (itemId, itemPrice) => {
    try {
      const selectedItem = this.state.items.find(item => item._id === itemId);
  
      if (!selectedItem || isNaN(itemPrice) || itemPrice <= 0) {
        throw new Error("Invalid item index or item price");
      }
  
      // Log the addresses for debugging
      console.log('Buyer Address:', this.accounts[0].toLowerCase());
      console.log('Item Creator Address:', selectedItem.fromAddress.toLowerCase());
  
      if (this.accounts[0].toLowerCase() === selectedItem.fromAddress.toLowerCase()) {
        throw new Error("Owner cannot buy their own product");
      }
  
      // Check if the item is already purchased
      if (selectedItem.status === "Purchased") {
        alert("This item has already been purchased.");
        return;
      }
  
      const valueInWei = this.web3.utils.toWei(itemPrice.toString(), 'wei');
      const itemIndexAsNumber = selectedItem.contractIndex;
  
      if (isNaN(itemIndexAsNumber)) {
        throw new Error("Invalid item contract index");
      }
  
      await this.itemManager.methods
        .triggerPayment(itemIndexAsNumber)
        .send({ from: this.accounts[0], value: valueInWei });
  
      const itemData = {
        index: selectedItem._id,
        status: "Purchased"
      };
  
      await axios.post("http://localhost:5000/api/items/update", itemData);
      alert('Item purchased successfully');
      this.loadItems();
    } catch (error) {
      console.error("Error buying item:", error.message);
      alert(`Error buying item: ${error.message}`);
    }
  };
  
  handleDeliverItem = async (itemId) => {
    try {
      const selectedItem = this.state.items.find(item => item._id === itemId);
  
      if (!selectedItem) {
        throw new Error("Invalid item index");
      }
  
      // Check if the current account is the owner
      if (this.accounts[0].toLowerCase() !== selectedItem.fromAddress.toLowerCase()) {
        throw new Error("Only the owner can deliver this item");
      }
  
      // Check if the item is in the Paid state
      if (selectedItem.status !== "Purchased") {
        alert("Item cannot be delivered as it has not been purchased yet.");
        return;
      }
  
      const itemIndexAsNumber = selectedItem.contractIndex;
  
      if (isNaN(itemIndexAsNumber)) {
        throw new Error("Invalid item contract index");
      }
  
      await this.itemManager.methods
        .triggerDelivery(itemIndexAsNumber)
        .send({ from: this.accounts[0] });
  
      const itemData = {
        index: selectedItem._id,
        status: "Delivered"
      };
  
      // Update the item status in the backend
      await axios.post("http://localhost:5000/api/items/update", itemData);
  
      // Update the item status in the state
      this.setState(prevState => ({
        items: prevState.items.map(item =>
          item._id === itemId ? { ...item, status: "Delivered" } : item
        )
      }));
  
      alert('Item delivered successfully');
    } catch (error) {
      console.error("Error delivering item:", error.message);
      alert(`Error delivering item: ${error.message}`);
    }
  };
  


  changeView = (view) => {
    this.setState({ currentView: view });
  };

  render() {
    if (!this.state.loaded) {
      return <div>Loading web3, accounts, and contract...</div>;
    }

    return (
      <div className="App">
        <Main
          currentView={this.state.currentView}
          items={this.state.items}
          onSubmit={this.handleSubmit}
          onInputChange={this.handleInputChange}
          onViewChange={this.changeView}
          handleBuyItem={this.handleBuyItem}
          handleDeliverItem={this.handleDeliverItem}
          account={this.state.account}
          categories={this.state.categories}
          imageURL={this.state.imageURL}
          // Pass the method to Main
        />
      </div>
    );
  }
}

export default App;