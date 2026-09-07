import bcrypt from 'bcrypt'

export const hashPassword = async function(password) {
   return await bcrypt.hash(password, 10)
}


export const isModified = async function(password, hashedPassword) {
   return await bcrypt.compare(password, hashedPassword)
}