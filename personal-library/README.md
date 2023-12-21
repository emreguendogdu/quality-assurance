### Problems faced, solutions
#### Try/catch for Invalid Users
> Finding a Mongoose entry with an invalid ID throws error. I used try/error to catch that error. But instead of using catch(err)'s err to display & understand error, we're sending user the id not found message.   
> !mongoose.Types.ObjectId.isValid(bookid) was an option to use I didn't prefer, as it requires mongoose.  
