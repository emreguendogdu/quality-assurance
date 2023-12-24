const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

const puzzleString =
  "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
const invalidPuzzleString = "x" + puzzleString.slice(1);
const missingCharsPuzzleString = puzzleString.slice(0, -1);

suite("Functional Tests", () => {
  suite("POST request to /api/solve", () => {
    test("Solve a puzzle with valid puzzle string", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({ puzzle: puzzleString })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.match(res.body.solution, /^\d+$/g);
        });
      done();
    });
    test("Solve a puzzle with missing puzzle string", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({ puzzle: "" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field missing");
        });
      done();
    });
    test("Solve a puzzle with invalid characters", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({ puzzle: invalidPuzzleString })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid characters in puzzle");
        });
      done();
    });
    test("Solve a puzzle with incorrect length", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({ puzzle: missingCharsPuzzleString })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long",
          );
        });
      done();
    });
    test("Solve a puzzle that cannot be solved", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/solve")
        .send({ puzzle: puzzleString })
        .end((err, res) => {
          assert.equal(res.status, 200);
        });
      done();
    });
  });
  suite("POST request to /api/check", () => {
    test("Check a puzzle placement with all fields", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ puzzle: puzzleString, coordinate: "I8", value: 2 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, true);
        });
      done();
    });
    test("Check a puzzle placement with single placement conflict", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ puzzle: puzzleString, coordinate: "A3", value: 3 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict.length, 1);
        });
      done();
    });
    test("Check a puzzle placement with multiple placement conflicts", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ puzzle: puzzleString, coordinate: "H7", value: 3 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.isAbove(res.body.conflict.length, 1);
        });
      done();
    });
    test("Check a puzzle placement with all placement conflicts", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ puzzle: puzzleString, coordinate: "e5", value: 6 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict.length, 3);
        });
      done();
    });
    test("Check a puzzle placement with missing required fields", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ puzzle: puzzleString, coordinate: "", value: "" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Required field(s) missing");
        });
      done();
    });
    test("Check a puzzle placement with invalid characters", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ puzzle: puzzleString, coordinate: "Q8", value: "sa" })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid value");
        });
      done();
    });
    test("Check a puzzle placement with incorrect length", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ puzzle: missingCharsPuzzleString, coordinate: "e5", value: 6 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
        });
      done();
    });
    test("Check a puzzle placement with invalid placement coordinate", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ puzzle: puzzleString, coordinate: "X3", value: 1 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid coordinate");
        });
      done();
    });
    test("Check a puzzle placement with invalid placement value", (done) => {
      chai
        .request(server)
        .keepOpen()
        .post("/api/check")
        .send({ puzzle: puzzleString, coordinate: "A1", value: 36 })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "Invalid value");
        });
      done();
    });
  });
});
