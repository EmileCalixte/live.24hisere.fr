import React from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import { Button } from "../ui/forms/Button";
import { Input } from "../ui/forms/Input";
import Page from "../ui/Page";

export default function SearchRunnerView(): React.ReactElement {
  const [search, setSearch] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false); // TODO this is just for test, remove this state

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    setIsLoading(true);
  };

  return (
    <Page id="search-runners" title="Rechercher un coureur">
      <Row>
        <Col>
          <h1>Rechercher un coureur</h1>
        </Col>
      </Row>

      <Row>
        <Col xxl={4} xl={4} lg={6} md={8} sm={12}>
          <form className="d-flex flex-sm-row flex-column gap-2 align-items-sm-end" onSubmit={onSubmit}>
            <Input
              className="flex-grow-1"
              label="Nom et/ou prénom"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              autoFocus={true}
            />

            <div className="d-flex">
              <Button className="flex-grow-1" type="submit" disabled={search.length < 1} isLoading={isLoading}>
                <FontAwesomeIcon icon={faSearch} className="me-2" />
                Rechercher
              </Button>
            </div>
          </form>
        </Col>
      </Row>
    </Page>
  );
}
