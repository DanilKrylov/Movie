import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Button } from "react-bootstrap";

export const SearchBar = ({handleShowCreateModal, setSearchString}) => {
  const [search, setSearch] = useState("")
  
  return (
    <>
      <div className="container p-4">
        <div className="row">
          <div id="imaginary_container">
            <div className="input-group stylish-input-group">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-control"
                placeholder="Search"
              ></input>
              <span onClick={() => setSearchString(search)} className="input-group-addon">
                <button type="submit">
                  <FontAwesomeIcon
                    FontAwesomeIcon
                    icon={faMagnifyingGlass}
                  ></FontAwesomeIcon>
                </button>
              </span>
            </div>
            <Button
              style={{width: '300px', margin: '0 10px'}}
                  variant="primary"
                  onClick={handleShowCreateModal}
                >
                  Create Cinema
            </Button>
          </div>
            
        </div>
      </div>
    </>
  );
};
