import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export default function RegistrationSuccessPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="flex w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <Card className="flex-1 flex flex-col justify-center border-none shadow-none">
          <CardHeader>
            <CardTitle>Registration Successful</CardTitle>
            <CardDescription>Your account has been created</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Thank you for registering. You can now log in to your account.</p>
          </CardContent>
          <CardFooter>
            <Link to="/login" passhref>
              <Button className="w-full bg-mainCustomColor hover:bg-teal-600">Go to Login</Button>
            </Link>
          </CardFooter>
        </Card>
        <div className="hidden md:block flex-1 bg-black">
          <img
            src="https://cdn.pixabay.com/photo/2022/06/20/10/41/registration-7273476_1280.png"
            alt="Success illustration"
            width={600}
            height={800}
            className="object-cover w-full h-full opacity-80"
          />
        </div>
      </div>
    </div>
  )
}

