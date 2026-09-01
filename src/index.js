import { prisma } from './db/dbConnect.js'
import app from './app.js'

const main = async function () {
    await prisma.$queryRaw`SELECT 1`
}

main()
.then(() => {
    console.log("Database Connection Successfull")

    // watches for server/port level failures
    app.on("error", (error) => {
        console.log("Error occured in connection!")
        process.exit(1)
    })

    app.listen(process.env.PORT, () => {
        console.log(`The server is listening on port ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("Database connecion failed: ", err)
})

// for prisma we dont need poo.on becoz prisma error hadnling for database issues happen naturally,
// per query through our database asynchandler mechanisma instead of try catch
