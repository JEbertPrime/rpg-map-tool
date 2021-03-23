import connectDB from '../../../../middleware/mongodb.js';
import Map from '../../../../models/map.js';
import { getSession } from 'next-auth/client'

const handler = async (req, res) => {
    const session = await getSession({ req })
    

    if(session){
        if (req.method === 'DELETE') {
            // Check if name, email or password is provided
            const { mapId, user } = JSON.parse(req.body);
            console.log(user)
            if(user == session.user.id){
            if (user) {
                try {
                
                //Find single map by id
                Map.deleteOne({_id:mapId}, function (err){
                    if(err){
                    res.status(500).send(err.message)
                    }else{
                        return res.status(200).send('deleted');

                    }
                })
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