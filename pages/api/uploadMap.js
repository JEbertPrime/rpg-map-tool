import aws from 'aws-sdk';
import rateLimit from '../../utils/rate-limit'
const limiter = rateLimit({
  interval: 60 * 1000 * 60, // 60 minutes
  uniqueTokenPerInterval: 50, // Max 500 users per second
})
export default async function handler(req, res) {
  try{
    await limiter.check(res, 10, 'CACHE_TOKEN') // 10 requests per minute
  aws.config.update({
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
    region: process.env.AWS_REGION,
    signatureVersion: 'v4',
  });

  const s3 = new aws.S3();
  const post = await s3.createPresignedPost({
    Bucket: process.env.AWS_BUCKET_NAME,
    Fields: {
      key: req.query.file,
    },
    Expires: 200, // seconds
    Conditions: [
      ['content-length-range', 0, 1048576],// up to 1 MB
    ],
  });
  res.status(200).json(post);
}catch{
  res.status(429).json({ error: 'Rate limit exceeded' })
}
}