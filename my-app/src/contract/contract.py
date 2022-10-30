from locale import locale_alias
from re import M
from pyteal import *

def approval_program():
  checkAddr = Addr("2HKBWROZZXDB7M7TMNNXILMEEMAFYD63H4SGAFQVBIADLY3GQQGUAYQDBE")
  App.globalPut(Bytes("creatorAddrr"), Addr("2HKBWROZZXDB7M7TMNNXILMEEMAFYD63H4SGAFQVBIADLY3GQQGUAYQDBE"))

  on_create = Seq([
   App.globalPut(Bytes("creatorAddrr"), Txn.sender()),
   Return(Int(1))
  ])

  def depositTocontract():
    return Seq(
      InnerTxnBuilder.Begin(), 
      InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.sender : Txn.sender(),
            TxnField.receiver : Global.current_application_address(),
            TxnField.amount: Int(1_000_000),
            TxnField.rekey_to : Txn.sender(),
        }),
        InnerTxnBuilder.Submit(),
        Approve()
    )

  def withdrawFromcontract():
    Assert(Txn.sender() == App.globalGet(Bytes("creatorAddrr")))
    
    return Seq(
      InnerTxnBuilder.Begin(), 
      InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.receiver : App.globalGet(Bytes("creatorAddrr")),
            TxnField.amount: Int(1_000_000),
        }),
        InnerTxnBuilder.Submit(),
        Approve()
    )

  def depositTocontractt():
    #print(App.globalGet(Bytes("txn_sender")))
    assetId = Btoi(Txn.application_args[0])
    return Seq(
      InnerTxnBuilder.Begin(), 
      InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetTransfer,
            TxnField.asset_sender : Txn.sender(),
            TxnField.asset_receiver : Global.current_application_address(),
            TxnField.asset_amount: Int(1),
            TxnField.xfer_asset : Gtxn[0].assets[0],
            TxnField.rekey_to : Txn.sender()
        }),
        InnerTxnBuilder.Submit(),
        Approve()
    )

  def createAsset():
    return Seq(
      InnerTxnBuilder.Begin(),
      InnerTxnBuilder.SetFields({
        TxnField.type_enum : TxnType.AssetConfig,
        TxnField.config_asset_name : Bytes("testNFT"),
        TxnField.config_asset_unit_name : Bytes("TNFT"),
        TxnField.config_asset_url : Bytes("https://yukesh.com"),
        TxnField.config_asset_decimals : Int(1),
        TxnField.config_asset_total : Int(1),
        TxnField.config_asset_manager : Txn.sender()
      }),
      InnerTxnBuilder.Submit(),
      App.globalPut(Bytes("token_ID"), InnerTxn.created_asset_id()),
      Approve()
    )  

    


  # Asset Transfer
  def transfer_asset(assetIndex, amount, receiver):
    return Seq([
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetTransfer,
            TxnField.asset_receiver: receiver,
            TxnField.asset_amount: amount,
            TxnField.xfer_asset: Txn.assets[assetIndex],
        }),
        InnerTxnBuilder.Submit(),
        Approve()
    ])

  contract_asset_optin = Seq([
    transfer_asset(0,Int(0), Global.current_application_address()),
    Approve()
  ])

  def buyNFT(receiver):
    return Seq([
        InnerTxnBuilder.Begin(),
        InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.AssetTransfer,
            TxnField.asset_receiver: receiver,
            TxnField.asset_amount: Int(1),
            TxnField.xfer_asset: Txn.assets[0], #ON CALL asset index 0 = wNGN and 1 = wGHC
        }),
        InnerTxnBuilder.Submit(),
        Approve()
    ])

  def TransferAlgoToOwner():
    return Seq(
      InnerTxnBuilder.Begin(), 
      InnerTxnBuilder.SetFields({
            TxnField.type_enum: TxnType.Payment,
            TxnField.sender : Txn.sender(),
            TxnField.receiver : Txn.accounts[1],
            TxnField.amount: Int(1_000_000),
            TxnField.rekey_to : Txn.sender()
        }),
        InnerTxnBuilder.Submit(),
        Approve()
  )

  on_withdraw = Seq([
    buyNFT(Txn.sender()),
    Approve()
  ])

  on_buy = Seq([
    TransferAlgoToOwner(),
    Approve()
  ])

  on_call = Cond(
    [Txn.application_args[0] == Bytes("SellAlgoBuyNFT"), depositTocontract()],
    [Txn.application_args[0] == Bytes("getAlgoFromContract"), withdrawFromcontract()],
    [Txn.application_args[0] == Bytes("sellNFT"), contract_asset_optin],
    [Txn.application_args[0] == Bytes("buyNFT"), on_buy],
    [Txn.application_args[0] == Bytes("withdraw"), on_withdraw],
    [Txn.application_args[0] == Bytes("GRP"),on_buy],
    [Txn.application_args[0] == Bytes("GRP1"),on_withdraw],
  )

  program = Cond( 
    [Txn.application_id() == Int(0), on_create],
    [Txn.on_completion() == OnComplete.NoOp, on_call],
  )
  return program


def clear_state_program(): 
    return Int(1)

with open("approval.teal", "w") as f:
    compiled = compileTeal(approval_program(), mode=Mode.Application, version=6)
    f.write(compiled)

with open("clear_state.teal", "w") as f:
    compiled = compileTeal(clear_state_program(), mode=Mode.Application, version=6)
    f.write(compiled)