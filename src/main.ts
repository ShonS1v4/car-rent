import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";

async function start () {
    const PORT = process.env.PORT || 3001
    const app = await NestFactory.create(AppModule)

    app.listen(PORT, () => {
        console.log(`Server started on address: localhost:${PORT}`)
    })
}

start()