import multer from 'multer'

// set of rules for knowing where to save  and wht to name it
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "./public/temp")
    },
    filename:  function(req, file, cb) {
        cb(null, file.originalname)
    }
})

// builds the actual above middleware, storage = above(storage)
export const upload = multer({storage})




/* Desitnation function: 
// Multer's OWN internal code, simplified
function handleUpload(req, file) {
    myConfig.destination(req, file, function(error, folderPath) {
        // Multer is WAITING here, for YOU to call this function
        if (error) {
            // handle the error
        } else {
            // Multer NOW knows: "ok, save the file INTO folderPath"
            actuallySaveTheFile(file, folderPath)
        }
    })
}
(similar for filname))
*/

