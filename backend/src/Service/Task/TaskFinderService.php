<?php 


declare(strict_types = 1);

namespace Src\Service\Task;

use Src\Entity\Task\Task;
use Src\Entity\Task\Exception\TaskNotFoundException;
use Src\Infrastructure\Repository\Task\TaskRepository;

final readonly class TaskFinderService {

    private TaskRepository $taskRepository;

    public function __construct() 
    {
        $this->taskRepository = new TaskRepository();
    }

    public function find(int $id): Task 
    {
        $task = $this->taskRepository->find($id);

        if ($task === null) {
            throw new TaskNotFoundException($id);
        }

        return $task;
    }

}
