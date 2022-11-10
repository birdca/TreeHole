# TreeHole

The concept of the TreeHole contract:
Some posts on the internet will be banned or be forced to be removed in some places, and this contract is for solving this problem.
The posts in the TreeHole are limited to 32 bits the most, for saving the storage and also want to make those posts be really concise.

About function post():
I try to implement the data structure like this: hashtable<timestamp, List<posts>>.
Posts are being stored by hashtable, the key of the hashtable is block timestamp.
If there are multiple posts in the same time frame, it'll be ordered by counting id.

About function get():
- use get(timestamp) to get how many secrets are there in the specifit timestamp.
- use get(timestamp, id) to get the secret.

About function search():
This is a unfinished function.
Ideally, use search(word) to find specific word in secrects, and it'll list out all the history secrets that mentioned this word, like the feature #tag.
[Note]: Where I'm stucked in is that the insertTag() not being triggered, but I didn't find out the reason yet.
