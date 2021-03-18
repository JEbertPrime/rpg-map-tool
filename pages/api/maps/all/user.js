import connectDB from '../../../../middleware/mongodb.js';
import Map from '../../../../models/map.js';
import { getSession } from 'next-auth/client'

const handler = async (req, res) => {
    const session = await getSession({ req })
    console.log(req.body, session.user.id)

    if(session){
        if (req.method === 'POST') {
            // Check if name, email or password is provided
            const { user } = JSON.parse(req.body);
            if(user == session.user.id){
            if (user) {
                try {
                
                //Find all maps and return in array
                const maps = await Map.find({user:user})
                console.log(maps)
                return res.status(200).send(maps);
                } catch (error) {
                return res.status(500).send(error.message);
                }
            } else {
                res.status(422).send('data_incomplete');
            }
        }else{
            res.status(401).send('User id mismatch')
        }
        } else {
            res.status(422).send('req_method_not_supported');
        }
    
    }
};

export default connectDB(handler);