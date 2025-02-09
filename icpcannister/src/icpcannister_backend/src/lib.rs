use candid::{Nat, Principal};
use icrc_ledger_types::icrc1::transfer::NumTokens;
use icrc_ledger_types::icrc1::transfer::TransferError;
use icrc_ledger_types::icrc1::{account::Account, transfer::TransferArg};
use std::cell::RefCell;

thread_local! {
    static LEDGER_ID: RefCell<Option<Principal>> = RefCell::new(None);
}

#[ic_cdk::init]
fn init(ledger_id: Principal) {
    LEDGER_ID.with(|id| {
        *id.borrow_mut() = Some(ledger_id);
    });
}

// token transfer on successful payment
// of icrc1 token
// after payment the model and the key gets AES encrypted and are
// sent to the contract
// pedersen commitments are semi-Homomorhpic encryption schemes and are used to verify them
#[ic_cdk::update]
async fn transfer_icrc1(to: String) -> Result<u64, String> {
    let ledger_id = LEDGER_ID.with(|id| id.borrow().expect("Ledger ID not initialized"));
    let to_account = Account {
        owner: Principal::from_text(&to).map_err(|e| format!("Invalid principal: {:?}", e))?,
        subaccount: None,
    };

    let int: u64 = 100_000;
    let transfer_args = TransferArg {
        from_subaccount: None,
        to: to_account,
        amount: NumTokens::from(int),
        fee: Some(NumTokens::from(int)),
        created_at_time: None,
        memo: None,
    };

    let transfer_result: Result<(Result<u64, TransferError>,), _> =
        ic_cdk::call(ledger_id, "transfer", (transfer_args,)).await;

    match transfer_result {
        Ok((Ok(block_height),)) => Ok(block_height),
        Ok((Err(transfer_error),)) => Err(format!("Transfer failed: {:?}", transfer_error)),
        Err(e) => Err(format!("Call to ledger failed: {:?}", e)),
    }
}

#[ic_cdk::query]
fn call_testing() -> String {
    String::from("OWNER")
}

ic_cdk::export_candid!();
