const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let issue1, issue2;

suite("Functional Tests", function () {
  suite("POST requests to /api/issues/{project}", () => {
    test("Create an issue with every field", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/ogtest")
        .set("content-type", "application/json")
        .send({
          issue_title: "Issue 1",
          issue_text: "Issue 1 text",
          created_by: "Issue 1 creator",
          assigned_to: "Issue 1 worker",
          status_text: "Waiting",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          issue1 = res.body;

          assert.equal(res.body.issue_title, "Issue 1");
          assert.equal(res.body.issue_text, "Issue 1 text");
          assert.equal(res.body.created_by, "Issue 1 creator");
          assert.equal(res.body.assigned_to, "Issue 1 worker");
          assert.equal(res.body.status_text, "Waiting");
          done();
        });
    });
    test("Create an issue with only required fields", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/ogtest")
        .set("content-type", "application/json")
        .send({
          issue_title: "Issue 2",
          issue_text: "Issue 2 text",
          created_by: "Issue 2 creator",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          issue2 = res.body;

          assert.equal(res.body.issue_title, "Issue 2");
          assert.equal(res.body.issue_text, "Issue 2 text");
          assert.equal(res.body.created_by, "Issue 2 creator");
          done();
        });
    });
    test("Create an issue with missing required fields", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/ogtest")
        .set("content-type", "application/json")
        .send({
          issue_title: "",
          issue_text: "",
          created_by: "",
          assigned_to: "Issue 3 worker",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    });
  });
  suite("GET requests to /api/issues/{project}", () => {
    test("View issues on a project", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/ogtest")
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        });
    });
    test("View issues on a project with one filter", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/ogtest")
        .query({ _id: issue1._id })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body[0].issue_title, issue1.issue_title);
          assert.equal(res.body[0].issue_text, issue1.issue_text);
          done();
        });
    });
    test("View issues on a project with multiple filters", (done) => {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/ogtest")
        .query({ _id: issue2._id, created_by: issue2.created_by })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body[0].issue_title, issue2.issue_title);
          assert.equal(res.body[0].created_by, issue2.created_by);
          done();
        });
    });
  });
  suite("PUT requests to /api/issues/{project}", () => {
    test("Update one field on an issue", (done) => {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/ogtest")
        .send({ _id: issue1._id, issue_text: "Updated issue 1 text" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body._id, issue1._id);
          assert.equal(res.body.result, "successfully updated");
          done();
        });
    });
    test("Update multiple fields on an issue", (done) => {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/ogtest")
        .send({
          _id: issue1._id,
          issue_text: "Updated issue 1 text",
          assigned_to: "New worker",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body._id, issue1._id);
          assert.equal(res.body.result, "successfully updated");
          done();
        });
    });
    test("Update an issue with missing _id", (done) => {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/ogtest")
        .send({
          issue_title: "Updated issue 1 title",
          assigned_to: "New worker",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
    test("Update an issue with no fields to update", (done) => {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/ogtest")
        .send({ _id: issue1._id })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "no update field(s) sent");
          done();
        });
    });
    test("Update an issue with an invalid _id", (done) => {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/ogtest")
        .send({ _id: "19", issue_title: "Updated this" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not update");
          assert.equal(res.body._id, "19");
          done();
        });
    });
  });
  suite("DELETE requests to /api/issues/{project}", () => {
    test("Delete an issue", (done) => {
      chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/ogtest")
        .send({ _id: issue2._id })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully deleted");
          done();
        });
    });
    test("Delete an issue with an invalid _id", (done) => {
      chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/ogtest")
        .send({ _id: "19" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not delete");
          assert.equal(res.body._id, "19");
          done();
        });
    });
    test("Delete an issue with missing _id", (done) => {
      chai
        .request(server)
        .keepOpen()
        .delete("/api/issues/ogtest")
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    });
  });
});
