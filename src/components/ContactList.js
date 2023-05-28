import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/addContact.module.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { API_URL } from "../utils/constants";
import {
  faPlus,
  faPenToSquare,
  faTrash,
  faArrowsRotate,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [selectedContact, setSelectedContact] = useState(null);
  library.add(faPlus, faPenToSquare, faTrash, faArrowsRotate);
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(API_URL);
      setContacts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
  };

  const addContact = async () => {
    try {
      const response = await axios.post(API_URL, newContact);
      setContacts([...contacts, response.data]);
      setNewContact({ name: "", email: "", phone: "" });
    } catch (error) {
      console.error(error);
    }
  };

  const updateContact = async () => {
    if (!selectedContact) return;

    try {
      await axios.put(`${API_URL}/${selectedContact.id}`, selectedContact);
      const updatedContacts = contacts.map((contact) =>
        contact.id === selectedContact.id ? selectedContact : contact
      );
      setContacts(updatedContacts);
      setSelectedContact(null);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteContact = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setContacts(contacts.filter((contact) => contact.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const selectContact = (contact) => {
    setSelectedContact(contact);
  };

  return (
    <div>
      <h2>Contact List</h2>
      <div className={styles.addContact}>
        {" "}
        <input
          type="text"
          name="name"
          value={newContact.name}
          onChange={handleInputChange}
          placeholder="Name"
          className={styles.inputFeild}
          required
        />
        <input
          type="text"
          name="email"
          value={newContact.email}
          onChange={handleInputChange}
          placeholder="E-mail"
          className={styles.inputFeild}
          required
        />
        <input
          type="text"
          name="phone"
          value={newContact.phone}
          onChange={handleInputChange}
          placeholder="Phone"
          className={styles.inputFeild}
          required
        />
        <button onClick={addContact} className={styles.button}>
          <FontAwesomeIcon
            icon="fa-solid fa-plus"
            size="xl"
            style={{ color: "#ffffff" }}
          />
        </button>
      </div>

      {selectedContact && (
        <div className={styles.addContact}>
          <input
            type="text"
            name="name"
            value={selectedContact.name}
            className={styles.inputFeild}
            onChange={(e) =>
              setSelectedContact({
                ...selectedContact,
                name: e.target.value,
              })
            }
          />

          <input
            type="text"
            name="email"
            value={selectedContact.email}
            className={styles.inputFeild}
            onChange={(e) =>
              setSelectedContact({
                ...selectedContact,
                email: e.target.value,
              })
            }
          />

          <input
            type="text"
            name="phone"
            className={styles.inputFeild}
            value={selectedContact.phone}
            onChange={(e) =>
              setSelectedContact({
                ...selectedContact,
                phone: e.target.value,
              })
            }
          />

          <button onClick={updateContact} className={styles.button}>
            <FontAwesomeIcon
              icon="fa-solid fa-arrows-rotate"
              size="xl"
              style={{ color: "#ffffff" }}
            />
          </button>
        </div>
      )}

      <table className={styles.contactList}>
        <thead>
          <tr>
            <th className={styles.heading}>Name</th>
            <th className={styles.heading}>Email</th>
            <th className={styles.heading}>Phone</th>
            <th className={styles.heading}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td className={styles.inputfeild_data}>{contact.name}</td>
              <td className={styles.inputfeild_data}>{contact.email}</td>
              <td className={styles.inputfeild_data}>{contact.phone}</td>
              <td>
                <button
                  className={styles.editBtn}
                  onClick={() => selectContact(contact)}
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-pen-to-square"
                    size="lg"
                    style={{ color: "#9dd3c3" }}
                  />{" "}
                  Edit
                </button>
                <button
                  className={styles.btnDelete}
                  onClick={() => deleteContact(contact.id)}
                >
                  <FontAwesomeIcon
                    icon="fa-solid fa-trash"
                    size="lg"
                    style={{ color: "#ddacac" }}
                  />{" "}
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactList;
