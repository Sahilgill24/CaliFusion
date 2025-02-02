#![allow(unused_crate_dependencies)]

use std::env::args;
// can store model as a key value after AES encryption
// key can be used then
// or can store it in the blob storage , but it is
// async and uses tokio and other difficulties
// blob's can only be accessed by those who have blobhash