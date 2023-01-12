export default (req, res, next) => {
  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }
  console.log(req.file)
  res.json({ secure_url: process.env.SERVER_URL + req.file.filename });
};
