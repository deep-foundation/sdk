# deep sdk

This is audiorecord deep package mvp. 

.env

NEXT_PUBLIC_GQL_PATH
NEXT_PUBLIC_GQL_SSL

to test:
inside app click Auth User
go to AudioRec page
click initialize package, it should create al nessesary links including AudioRecords nested in User.
then you must check device support and give permissions to record. 
then you can start recording cycle which records 5sec chunks or record one chunk.
when uploading, all data will be stored as links inside that AudioRecords container link.
click upload records to playback.