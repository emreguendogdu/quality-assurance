### Problems faced, solutions
#### Try/catch for Invalid Users
> Finding a Mongoose entry with an invalid ID throws and error. Using try/error makes us catch that error, so we don't use catch (err)'s err value to console.log it to development as we know the issue, but we send user the id not found message instead. !mongoose.Types.ObjectId.isValid(bookid) was an option to use I didn't prefer, as it requires mongoose.
