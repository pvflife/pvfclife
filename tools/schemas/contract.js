import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ContractSchema = new Schema({
  signature_capture: String,
});

const Contract = mongoose.model('contracts', ContractSchema);

export default Contract;
