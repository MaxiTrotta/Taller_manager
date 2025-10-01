<?php 

use Src\Service\Employed\EmployeesSearcherService;

final readonly class EmployeesGetController {

    private EmployeesSearcherService $service;

    public function __construct() {
        $this->service = new EmployeesSearcherService();
    }

    public function start(): void 
    {
        $response = $this->service->search();
        echo json_encode($this->filterResponses($response), true);
    }

    private function filterResponses(array $responses): array
    {
        $result = [];

        foreach ($responses as $response) {
            $result[] = [
                "id" => $response->id(),
                "idSector" => $response->idSector(),
                "sectorName" => $response->sectorName(),
                "name" => $response->name(),
                "cuilCuit" => $response->cuilCuit(),
                "phone" => $response->phone(),
                "email" => $response->email(),
                "address" => $response->address()
            ];
        }

        return $result;
    }
} 


// namespace Src\Controller\Employed;

// final class EmployeesGetController {

//     public function start(): void 
//     {
//         // Datos simulados
//         $dummyEmployees = [
//             [
//                 "id" => 1,
//                 "name" => "Maxi",
//                 "cuilCuit" => "20-12345678-9",
//                 "phone" => "+54 2346 555555",
//                 "email" => "maxi@gmail.com",
//                 "address" => "Calle Falsa 123"
//             ],
//             [
//                 "id" => 2,
//                 "name" => "Ivan",
//                 "cuilCuit" => "23-87654321-0",
//                 "phone" => "+54 2346 555555",
//                 "email" => "ivan@gmail.com",
//                 "address" => "Avenida Siempre Viva 456"
//             ],
//             [
//                 "id" => 3,
//                 "name" => "Julia",
//                 "cuilCuit" => "27-11223344-5",
//                 "phone" => "+54 2346 555555",
//                 "email" => "julia@gmail.com",
//                 "address" => "Calle Luna 789"
//             ]
//         ];

//         // Enviar JSON al frontend
//         header('Content-Type: application/json');
//         echo json_encode($dummyEmployees);
//     }
// }
